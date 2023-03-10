import { writeFile } from "fs/promises"
import { fetchTreeviewFromURL } from "./treeview-parser"
import { CUSTOM_WORLD_GEN_URL } from "./fandom"

!(async () => {
    await writeFile("../custom-world-generation-noise.json",
        JSON.stringify(
            await fetchTreeviewFromURL(
                CUSTOM_WORLD_GEN_URL, ".treeview > ul > li"
            )
            , null, 4
        )
    );
})()