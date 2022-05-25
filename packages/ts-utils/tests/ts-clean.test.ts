import { execSync } from "child_process"
import fs from "fs"

const makeFolder = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const makeFile = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, "Hellow, Kitty!!!")
    }
}

const deleteFolder = (path: string) => {
    if (fs.existsSync(path)) {
        fs.rmSync(path, {
            recursive: true,
            force: true,
        })
    }
}

const isExisting = (path: string): boolean => {
    return fs.existsSync(path)
}

beforeAll(() => {
    makeFolder("jest-test")
})

afterAll(() => {
    // deleteFolder("jest-test")
})

describe("Delete folders and files", () => {
    //ts-node -r tsconfig-paths/register src/clean.ts *.tsbuildinfo lib dist yarn-error.log
    test("Should delete a folder", async () => {
        makeFolder("./jest-test/dist")
        expect(isExisting("./jest-test/dist")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/dist", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/dist")).toBeFalsy()
    })

    test("Should delete a sub folder under a folder", async () => {
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/dist/bin")
        expect(isExisting("./jest-test/dist/bin")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/dist/bin", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/dist/bin")).toBeFalsy()
    })

    test("Should delete a file", async () => {
        makeFile("./jest-test/abc.log")
        expect(isExisting("./jest-test/abc.log")).toBeTruthy

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/abc.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/abc.log")).toBeFalsy()
    })

    test("Should delete a file under a folder", async () => {
        makeFolder("./jest-test/logs")
        makeFile("./jest-test/logs/def.log")
        expect(isExisting("./jest-test/logs/def.log")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/logs/def.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/logs/def.log")).toBeFalsy()
    })

    test("Should delete files with wildcard", async () => {
        for (let i = 0 ; i < 10 ; i++) {
            makeFile(`./jest-test/${i}.log`)
        }
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./jest-test/${i}.log`)).toBeTruthy()
        }
        
        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/*.log", {
            stdio: "inherit",
        })
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./jest-test/${i}.log`)).toBeFalsy()
        }
    })

    test("Should delete files with wildcard in a sub folder", async () => {
        for (let i = 0 ; i < 10 ; i++) {
            makeFile(`./jest-test/logs/${i}.log`)
        }
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./jest-test/logs/${i}.log`)).toBeTruthy()
        }
        
        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/logs/*.log", {
            stdio: "inherit",
        })
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./jest-test/logs/${i}.log`)).toBeFalsy()
        }
    })
})

describe("Delete files and directories in the nested directory", () => {
    test("Should delete a folder under the nested folders", async () => {
        makeFolder("./jest-test/bin")
        makeFolder("./jest-test/nest")
        makeFolder("./jest-test/nest/bin")
        makeFolder("./jest-test/nest/dist")
        makeFolder("./jest-test/nest/dist/bin")
        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/bin", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeFalsy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeFalsy()
    })

    test("Should delete a sub folder under the nested folders", async () => {
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/dist/bin")
        makeFolder("./jest-test/nest")
        makeFolder("./jest-test/nest/dist")
        makeFolder("./jest-test/nest/dist/bin")
        makeFolder("./jest-test/nest/lib")
        makeFolder("./jest-test/nest/lib/dist")
        makeFolder("./jest-test/nest/lib/dist/bin")
        expect(isExisting("./jest-test/dist/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/lib/dist/bin")).toBeTruthy()
        
        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/dist/bin", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/dist/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeFalsy()
        expect(isExisting("./jest-test/nest/lib/dist/bin")).toBeFalsy()
    })

    test("Should delete a file in the nested folders", async () => {

    })

    test("Should delete files with wildcard in the nested folders", async () => {
        
    })
})

describe("Run dry run", () => {

})
