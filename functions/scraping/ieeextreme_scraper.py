from playwright.sync_api import sync_playwright
import datetime
import time

LATAM_COUNTRIES = [
    "Argentina"
]

def wait_for_table_stable(page, timeout=30, check_interval=1):
    start = time.time()
    prev_count = 0
    stable_for = 0

    while time.time() - start < timeout:
        rows = page.query_selector_all("#tablepress-28 tbody tr")
        count = len(rows)
        if count == prev_count:
            stable_for += check_interval
            if stable_for >= 2:
                return rows
        else:
            stable_for = 0
            prev_count = count
        time.sleep(check_interval)

    return page.query_selector_all("#tablepress-28 tbody tr")


def scrape_ieeextreme_paginated(page):
    _ = wait_for_table_stable(page, timeout=60)
    print("✅ Tabla inicial cargada y estable")

    try:
        cookie_banner = page.query_selector(".hustle-button-close")
        if cookie_banner:
            cookie_banner.click()
            page.wait_for_timeout(500)
            print("✅ Banner de cookies cerrado")
    except:
        pass

    all_data = []
    page_number = 1

    while True:
        print(f"📄 Leyendo página {page_number}...")

        rows = page.query_selector_all("#tablepress-28 tbody tr")
        for row in rows:
            cols = [c.inner_text().strip() for c in row.query_selector_all("td")]
            if len(cols) >= 3 and cols[2] in LATAM_COUNTRIES:
                all_data.append({
                    "team": cols[0],
                    "university": cols[1],
                    "country": cols[2],
                    "region": cols[3],
                    "globalRank": int(cols[4]),
                    "regionRank": int(cols[5]),
                    "countryRank": int(cols[6]),
                    "universityRank": int(cols[7]),
                    "timestamp": datetime.datetime.utcnow()
                })

        next_button = page.query_selector("button.next")
        if not next_button or "disabled" in next_button.get_attribute("class"):
            print("✅ No hay más páginas")
            break

        next_button.click()
        page_number += 1

    return all_data


def scrape_ieeextreme_local():
    print("Iniciando scraping de IEEEXtreme...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=100)
        page = browser.new_page()
        page.goto("https://ieeextreme.org/ieeextreme-18-0-ranking/", timeout=60000)

        data = scrape_ieeextreme_paginated(page)
        browser.close()

    print(f"✅ Total equipos LATAM encontrados: {len(data)}")
    for team in data[:10]:
        print(team)

    return data


if __name__ == "__main__":
    scrape_ieeextreme_local()
