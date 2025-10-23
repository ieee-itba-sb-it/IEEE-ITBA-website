import axios from "axios";
import * as cheerio from "cheerio";
import {getFirestore} from "firebase-admin/firestore";

export async function scrapingIeeextreme(): Promise<void> {
    const url = "https://ieeextreme.org/ieeextreme-18-0-ranking/";

    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    };

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        const table = $("#tablepress-28");
        if (!table.length) {
            console.error("❌ No se encontró la tabla del ranking.");
            return;
        }

        const rows = table.find("tbody tr");
        const collectionRef = getFirestore().collection("ieeextreme-teams");
        let addedCount = 0;

        for (const row of rows.toArray()) {
            const cols = $(row)
                .find("td")
                .map((_, td) => $(td).text().trim())
                .get();

            if (cols.length === 8) {
                const [
                    team_name,
                    university,
                    country,
                    region,
                    global_rank,
                    region_rank,
                    country_rank,
                    university_rank,
                ] = cols;

                if (country.toLowerCase() === "argentina") {
                    const data = {
                        team_name,
                        university,
                        country,
                        region,
                        global_rank: parseInt(global_rank, 10),
                        region_rank: parseInt(region_rank, 10),
                        country_rank: parseInt(country_rank, 10),
                        university_rank: parseInt(university_rank, 10),
                    };

                    await collectionRef.doc(team_name).set(data);
                    addedCount++;
                    console.log(`✅ Guardado en Firestore: ${team_name}`);
                }
            }
        }

        console.log(`\n🏁 Total de equipos argentinos guardados: ${addedCount}`);
    } catch (err) {
        console.error("❌ Error en el scraping:", err);
    }
}
