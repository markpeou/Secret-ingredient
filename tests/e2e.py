"""
End-to-end browser test (Playwright, headless Chromium).

  python3 -m http.server 8000      # in the project folder
  python3 tests/e2e.py [base_url] [screenshot_dir]

Plays several full sessions on a phone viewport, checks back navigation,
keyboard input, the hidden theme, percentage totals, copy and restart.
"""
import re, sys, random, os
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/index.html"
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
BANNED = re.compile(r"\b(spices?|flavou?rs?|dish(es)?|chilli|ginger|cardamom|pepper|cinnamon|anise|cumin|turmeric|saffron|coriander|fennel|fenugreek|mustard|nutmeg|sesame|caraway|allspice|paprika|vanilla|tamarind|sichuan|sumac|cloves|lavender|galangal|recipe|cook(ing)?|food)\b", re.I)
errors = []

def shot(page, name):
    if SHOTS:
        os.makedirs(SHOTS, exist_ok=True)
        page.screenshot(path=os.path.join(SHOTS, name + ".png"), full_page=True)

def assert_hidden_theme(page, where):
    text = page.inner_text("#app")
    m = BANNED.search(text)
    assert not m, f"theme leaked on {where}: {m.group(0)!r} in {text[:200]!r}"

def dock_visible(page, where):
    """The next step must be on screen without scrolling."""
    box = page.evaluate("(()=>{const d=document.querySelector('.dock'); const r=d.getBoundingClientRect(); return [r.top, r.bottom, innerHeight]})()")
    assert box[0] >= 0 and box[1] <= box[2] + 1, f"dock off screen on {where}: {box}"

def play(page, rng, keyboard=False, screenshots=False):
    page.goto(BASE)
    expect(page.locator("h1")).to_have_text("Let’s get to know you.")
    assert_hidden_theme(page, "welcome")
    dock_visible(page, "welcome")
    if screenshots: shot(page, "1-welcome")
    page.click("text=Let’s go")

    n = 10
    for i in range(n):
        expect(page.locator(".q-count")).to_have_text(f"{i + 1} / {n}")
        expect(page.locator(".q-card.entering")).to_have_count(0)  # slide-in finished, taps accepted
        assert_hidden_theme(page, f"question {i + 1}")
        dock_visible(page, f"question {i + 1}")
        assert page.locator("#next").count() == 0, "no Next button: answering moves on by itself"
        assert page.locator("input[name=answer]:checked").count() == 0, "fresh question should start unanswered"
        # Every option is visible without scrolling
        hidden = page.evaluate("(()=>{const d=document.querySelector('.dock').getBoundingClientRect().top; return [...document.querySelectorAll('.option')].filter(o=>o.getBoundingClientRect().bottom>d+1).length})()")
        assert hidden == 0, f"{hidden} options hidden behind the dock on question {i + 1}"
        # The question card hugs its options (no empty space under the last one)
        gap = page.evaluate("(()=>{const c=document.querySelector('.q-card').getBoundingClientRect(),o=[...document.querySelectorAll('.option')].pop().getBoundingClientRect();return c.bottom-o.bottom})()")
        assert gap <= 24, f"empty space under the options on question {i + 1}: {gap}px"
        k = rng.randrange(page.locator(".option").count())
        if keyboard:
            page.keyboard.press(str(k + 1))
        else:
            page.locator(".option").nth(k).click()
        expect(page.locator(".option").nth(k).locator("input")).to_be_checked()
        assert page.locator("#q-pip .pip").count() == 1, "Pipi missing"
        if screenshots and i == 0: shot(page, "2-question")
        # Auto-advance after Pipi reacts
        if i < n - 1:
            expect(page.locator(".q-count")).to_have_text(f"{i + 2} / {n}", timeout=3000)
        else:
            expect(page.locator("h1")).to_have_text("Everyone has a signature.", timeout=3000)
        # Back keeps the previous answer, and Next moves on again
        if i == 2:
            page.click("[data-action=back]")
            expect(page.locator(".q-count")).to_have_text("3 / 10")
            expect(page.locator(".q-card.entering")).to_have_count(0)
            assert page.locator("input[name=answer]:checked").count() == 1, "answer lost on back"
            # Tapping the already-selected answer carries on
            page.locator("input[name=answer]:checked").locator("xpath=..").click()
            expect(page.locator(".q-count")).to_have_text("4 / 10")

    assert_hidden_theme(page, "transition")
    dock_visible(page, "transition")
    if screenshots: shot(page, "3-transition")
    page.click("text=Change an answer")
    expect(page.locator(".q-count")).to_have_text("10 / 10")
    expect(page.locator(".q-card.entering")).to_have_count(0)
    page.locator("input[name=answer]:checked").locator("xpath=..").click()
    page.click("text=Discover my blend")

    # Blend reveal
    expect(page.locator(".eyebrow")).to_have_text("Your spice blend")
    dock_visible(page, "blend")
    pcts = [int(t.rstrip("%")) for t in page.locator(".spice-row .pct").all_inner_texts()]
    assert 3 <= len(pcts) <= 6, pcts
    assert sum(pcts) == 100, pcts
    assert page.locator(".spice-row .role-tag").count() == len(pcts)
    assert page.locator(".because").count() == 0, "answers must not be tied to spices"
    assert page.locator(".summary .g-seg .spice-char").count() == len(pcts)
    assert page.evaluate("(()=>{const r=SI.app.getState().result; return r.blend.every(b=>r.dish.spices[b.spice.id]);})()"), "blend spice outside the dish"
    assert "you chose" not in page.inner_text("#app").lower()
    assert page.locator(".chips li").count() == len(pcts)
    assert page.locator(".dish-art").count() == 0, "dish shown before its reveal"
    # Tapping a gauge slice brings that spice into view
    last = len(pcts) - 1
    page.locator(".summary .g-seg").nth(last).click()
    expect(page.locator(".dot").nth(last)).to_have_attribute("aria-current", "true", timeout=3000)
    body = page.inner_text("#app")
    assert "undefined" not in body and "NaN" not in body
    name = page.inner_text("#h")
    if screenshots: page.wait_for_timeout(1300); shot(page, "4-blend")

    # Dish reveal
    page.click("text=Reveal my dish")
    expect(page.locator(".dish-art")).to_be_visible()
    dish = page.inner_text("#h")
    dock_visible(page, "dish")
    page.wait_for_timeout(1500)
    w = page.evaluate("[document.documentElement.scrollWidth, document.documentElement.clientWidth]")
    assert w[0] <= w[1], f"dish screen scrolls sideways: {w}"
    if screenshots: page.wait_for_timeout(800); shot(page, "5-dish")
    # Signature dish stamp sits fully inside the stage
    st = page.evaluate("(()=>{const s=document.querySelector('.stage').getBoundingClientRect(), t=document.querySelector('.stamp').getBoundingClientRect(); return [t.bottom + 4, s.bottom]})()")
    assert st[0] <= st[1] + 0.5, f"stamp clipped by the stage: {st}"

    # Card screen: two-sided card, flips, each side saves
    page.click("text=My card")
    expect(page.locator("#tcg .tcg-front img")).to_be_visible(timeout=8000)
    dock_visible(page, "card")
    reduced = page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
    learned = page.evaluate("(()=>{try{return localStorage.getItem('si-flip-learned')==='1'}catch(e){return false}})()")
    # Pops out of the recipe file, cloche lifts, then the card jiggles until flipped
    if not reduced:
        expect(page.locator("#slot.revealing")).to_have_count(1)
        expect(page.locator(".deck-front")).to_be_visible()
    page.wait_for_timeout(3000)
    expect(page.locator(".deck-front")).to_be_hidden()
    expect(page.locator(".card-cloche")).to_be_hidden()
    if not reduced and not learned:
        expect(page.locator("#pop.nudge")).to_have_count(1)
        page.wait_for_timeout(250)
        assert page.evaluate("getComputedStyle(document.getElementById('pop')).animationName") == "nudge", "card isn't jiggling"
    cb = page.evaluate("(()=>{const t=document.getElementById('tcg'); const r=t.getBoundingClientRect(); const d=document.querySelector('.dock').getBoundingClientRect(); return [r.top + t.offsetHeight, d.top, t.offsetWidth]})()")
    assert cb[0] <= cb[1] + 1, f"card hidden behind the dock: {cb}"
    assert cb[2] >= 200, f"card too small: {cb}"
    sizes = page.evaluate("[...document.querySelectorAll('#tcg img')].map(i=>[i.naturalWidth,i.naturalHeight])")
    assert sizes == [[750, 1050], [750, 1050]], sizes
    expect(page.locator("#save-btn")).to_have_attribute("aria-label", "Save front")
    with page.expect_download() as dl:
        page.click("#save-btn")
    assert dl.value.suggested_filename.endswith("-front.png"), dl.value.suggested_filename
    if screenshots and SHOTS: dl.value.save_as(os.path.join(SHOTS, "8-card-front.png")); shot(page, "6-card")
    page.click("#flip-btn")
    expect(page.locator("#tcg")).to_have_class(re.compile("flipped"))
    expect(page.locator("#pop.nudge")).to_have_count(0)  # no more jiggling once they've flipped
    expect(page.locator("#save-btn")).to_have_attribute("aria-label", "Save back")
    with page.expect_download() as dl2:
        page.click("#save-btn")
    assert dl2.value.suggested_filename.endswith("-back.png"), dl2.value.suggested_filename
    if screenshots and SHOTS: dl2.value.save_as(os.path.join(SHOTS, "9-card-back.png"))
    page.click(".tcg-back")
    expect(page.locator("#tcg")).not_to_have_class(re.compile("flipped"))

    # Share card: one action, both sides as two separate PNGs
    expect(page.locator("#share-btn")).to_be_visible()
    if not page.evaluate("!!(navigator.share && navigator.canShare)"):
        # No file sharing here (desktop Chromium): both sides download instead
        with page.expect_download() as d1:
            page.click("#share-btn")
        page.wait_for_timeout(600)
        assert d1.value.suggested_filename.endswith("-front.png")
    # With file sharing (mocked like a phone): one share sheet, two files
    page.evaluate("""(()=>{window.__shared=null;
        navigator.canShare=(d)=>!!(d&&d.files);
        navigator.share=(d)=>{window.__shared={n:d.files.length,names:d.files.map(f=>f.name),types:d.files.map(f=>f.type),text:d.text};return Promise.resolve();};})()""")
    page.click("#share-btn")
    expect(page.locator("#share-status")).to_contain_text("Shared")
    shared = page.evaluate("window.__shared")
    assert shared["n"] == 2 and shared["names"][0].endswith("-front.png") and shared["names"][1].endswith("-back.png"), shared
    assert shared["types"] == ["image/png", "image/png"] and dish in shared["text"], shared
    # Share blocked (as in an embedded page): falls back to saving both
    page.evaluate("(()=>{navigator.share=()=>Promise.reject(Object.assign(new Error('x'),{name:'NotAllowedError'}));})()")
    with page.expect_download() as d2:
        page.click("#share-btn")
    assert d2.value.suggested_filename.endswith("-front.png")
    page.wait_for_timeout(600)

    # Copy
    page.click("[data-action=copy]")
    expect(page.locator("#share-status")).to_contain_text(re.compile("Copied|Copying"))
    status = page.inner_text("#share-status")
    if "Copied" in status:
        clip = page.evaluate("navigator.clipboard.readText()")
        assert dish in clip, clip
    else:
        assert "isn’t available" in status, status

    # Back through the screens keeps the same result
    page.click("text=‹ My dish")
    assert page.inner_text("#h") == dish
    page.click("[data-action=to-blend]")
    assert page.inner_text("#h") == name
    page.click("text=Reveal my dish")
    page.click("text=My card")

    # Restart resets everything
    page.click(".card-head [data-action=restart]")
    expect(page.locator("h1")).to_have_text("Let’s get to know you.")
    state = page.evaluate("({a: Object.keys(SI.app.getState().answers).length, r: SI.app.getState().result, i: SI.app.getState().index})")
    assert state == {"a": 0, "r": None, "i": 0}, state
    return name, dish

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 390, "height": 720}, device_scale_factor=2, has_touch=False,
                              permissions=["clipboard-read", "clipboard-write"])
    page = ctx.new_page()
    page.on("console", lambda m: errors.append(m.text) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(str(e)))

    # Every illustration must be strict XML, or it can't be drawn onto the card
    page.goto(BASE)
    bad = page.evaluate("""()=>{ const bad=[]; const chk=(n,svg)=>{ const d=new DOMParser().parseFromString(svg,'image/svg+xml'); if(d.querySelector('parsererror')) bad.push(n); };
      SI.DISHES.forEach(d=>chk(d.id, SI.art.dish(d))); SI.SPICES.forEach(s=>chk(s.id, SI.chars.spice(s.id)));
      Object.keys(SI.chars.EXPRESSIONS).concat(['wave','cheer']).forEach(m=>chk('pip-'+m, SI.chars.pip(m))); return bad; }""")
    assert not bad, "invalid SVG: " + ", ".join(bad)

    # A card renders for every dish
    failed = page.evaluate("""async()=>{ const seen={}, bad=[]; let seed=5; const r=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
      for(let i=0;i<4000 && Object.keys(seen).length<SI.DISHES.length;i++){ const qs=SI.engine.selectQuestions(10,r);
        const res=SI.engine.interpret(qs.map(q=>({questionId:q.id,optionIndex:Math.floor(r()*q.options.length)})));
        if(seen[res.dish.id]) continue; seen[res.dish.id]=1;
        try{ const c=await SI.card.render(res); if(c.front.blob.size<20000||c.back.blob.size<20000) bad.push(res.dish.id+' tiny'); }catch(e){ bad.push(res.dish.id+': '+e.message); } }
      return {bad, n:Object.keys(seen).length}; }""")
    assert not failed["bad"] and failed["n"] == page.evaluate("SI.DISHES.length"), failed

    rng = random.Random(4)
    results = []
    for run in range(6):
        results.append(play(page, rng, keyboard=(run % 2 == 1), screenshots=(run == 0)))
    print("Sessions:", *results, sep="\n  ")

    # No horizontal scroll at phone width on any screen
    page.goto(BASE)
    sw = page.evaluate("document.documentElement.scrollWidth")
    assert sw <= 390, f"horizontal overflow: {sw}"

    # Reduced motion: cloche hidden, result visible immediately
    rm = browser.new_context(viewport={"width": 390, "height": 720}, reduced_motion="reduce")
    rp = rm.new_page()
    play(rp, random.Random(9))
    rm.close()

    # Desktop layout
    desk = browser.new_context(viewport={"width": 1280, "height": 900})
    dp = desk.new_page()
    dp.goto(BASE)
    if SHOTS: shot(dp, "6-desktop-welcome")
    desk.close()
    browser.close()

fonts = [e for e in errors if "fonts.g" in e or "ERR_TUNNEL" in e or "ERR_INTERNET" in e or "ERR_NAME" in e]  # offline font fetch is not an app error
real = [e for e in errors if e not in fonts]
assert not real, "console errors: " + "; ".join(real)
print("E2E OK" + (f" (ignored {len(fonts)} font-network messages)" if fonts else ""))
