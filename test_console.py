from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    page.on("console", lambda msg: print(f"CONSOLE {msg.type}: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    
    browser.close()