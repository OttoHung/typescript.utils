import { execSync } from "child_process"
import fs from "fs"
import path from "path"

const makeFolder = (dir: string, name: string) => {
    const folderPath = path.resolve(dir, name)
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }
}

describe("Clean folders", () => {
    //ts-node -r tsconfig-paths/register src/clean.ts *.tsbuildinfo lib dist yarn-error.log
    it("Should delete a folder", async () => {
        makeFolder("./", "first-layer")
        expect(fs.existsSync("first-layer")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/clean.ts first-layer")
        expect(fs.existsSync("first-layer")).toBeFalsy()
    })

    it("Should delete a sub folder under a folder", async () => {
        makeFolder("./", "first-layer")
        makeFolder("./first-layer", "second-layer")
        
        const folderPath = path.resolve("./first-layer", "second-layer")
        expect(fs.existsSync(folderPath)).toBeTruthy()

        execSync(`ts-node -r tsconfig-paths/register src/clean.ts /**/second-layer`)
        expect(fs.existsSync(folderPath)).toBeFalsy()
    })
})
