import { execSync } from "child_process"
import fs from "fs"
import path from "path"

const makeFolder = (dir: string, name: string) => {
    const folderPath = path.resolve(dir, name)
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
    }
}

describe("Delete folders and files", () => {
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

        execSync(`ts-node -r tsconfig-paths/register src/clean.ts packages/**/second-layer`)
        expect(fs.existsSync(folderPath)).toBeFalsy()
    })

    it("Should delete a sub folder under the nested folders", async () => {

    })

    it("Should delete a file", async () => {

    })

    it("Should delete a file under a folder", async () => {

    })

    it("Should delete a file in the nested folders", async () => {

    })

    it("Should delete files with wildcard", async () => {

    })

    it("Should delete files with wildcard in a sub folder", async () => {

    })

    it("Should delete files with wildcard in the nested folders", async () => {
        
    })
})
