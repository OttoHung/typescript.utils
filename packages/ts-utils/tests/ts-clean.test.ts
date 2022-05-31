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
    deleteFolder("jest-test")
})

describe("Delete folders", () => {
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
})

describe("Delete files", () => {
    test("Should delete a file", async () => {
        makeFile("./jest-test/abc.log")
        expect(isExisting("./jest-test/abc.log")).toBeTruthy()

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

describe("Delete directories in the nested directories", () => {
    test("Should delete a folder under the nested folders", async () => {
        makeFolder("./jest-test/bin")
        makeFolder("./jest-test/nest")
        makeFolder("./jest-test/nest/bin")
        makeFolder("./jest-test/nest/dist")
        makeFolder("./jest-test/nest/dist/bin")
        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeTruthy()

        execSync('ts-node -r tsconfig-paths/register src/ts-clean.ts "jest-test/**/bin"', {
            stdio: "inherit",
        })

        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeFalsy()
        expect(isExisting("./jest-test/nest/dist/bin")).toBeFalsy()
    })

    test("Should delete a sub folder under the nested folders", async () => {
        makeFolder("./jest-test/bin")
        makeFolder("./jest-test/pub")
        makeFolder("./jest-test/pub/bin")

        makeFolder("./jest-test/nest")
        makeFolder("./jest-test/nest/bin")
        makeFolder("./jest-test/nest/lib")
        makeFolder("./jest-test/nest/lib/bin")
        makeFolder("./jest-test/nest/lib/pub")
        makeFolder("./jest-test/nest/lib/pub/bin")
        makeFolder("./jest-test/nest/pub")
        makeFolder("./jest-test/nest/pub/bin")

        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/pub/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/pub/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/lib/pub/bin")).toBeTruthy()
        
        execSync('ts-node -r tsconfig-paths/register src/ts-clean.ts "jest-test/**/pub/bin"', {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
        expect(isExisting("./jest-test/pub/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/lib/bin")).toBeTruthy()
        expect(isExisting("./jest-test/nest/pub/bin")).toBeFalsy()
        expect(isExisting("./jest-test/nest/lib/pub/bin")).toBeFalsy()
    })
})

describe("Delete files in the nested directories", () => {
    test("Should delete a file in the nested folders", async () => {
        makeFolder("./jest-test/logs")
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/bin")
        makeFile("./jest-test/0.log")
        makeFile("./jest-test/logs/0.log")
        makeFile("./jest-test/dist/0.log")
        makeFile("./jest-test/bin/0.log")
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/0.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/0.log")).toBeFalsy()
        expect(isExisting("./jest-test/dist/0.log")).toBeFalsy()
        expect(isExisting("./jest-test/bin/0.log")).toBeFalsy()
    })

    test("Should delete a file in a folder in the nested folder", async () => {
        makeFolder("./jest-test/logs")
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/bin")
        makeFolder("./jest-test/tim")
        makeFolder("./jest-test/bin/tim")
        makeFile("./jest-test/0.log")
        makeFile("./jest-test/logs/0.log")
        makeFile("./jest-test/dist/0.log")
        makeFile("./jest-test/bin/0.log")
        makeFile("./jest-test/tim/0.log")
        makeFile("./jest-test/bin/tim/0.log")
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/tim/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/tim/0.log")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/tim/0.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/0.log")).toBeTruthy()        
        expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/tim/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/tim/0.log")).toBeFalsy()
    })

    test("Should delete files with wildcard in the nested folders", async () => {
        makeFolder("./jest-test/logs")
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/bin")
        makeFile("./jest-test/0.log")
        makeFile("./jest-test/logs/1.log")
        makeFile("./jest-test/dist/2.log")
        makeFile("./jest-test/bin/3.log")
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/*.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/1.log")).toBeFalsy()
        expect(isExisting("./jest-test/dist/2.log")).toBeFalsy()
        expect(isExisting("./jest-test/bin/3.log")).toBeFalsy()        
    })

    test("Should delete files in a folder with wildcard in the nested folders", async () => {
        makeFolder("./jest-test/logs")
        makeFolder("./jest-test/dist")
        makeFolder("./jest-test/bin")
        makeFolder("./jest-test/tim")
        makeFolder("./jest-test/bin/tim")
        makeFile("./jest-test/0.log")
        makeFile("./jest-test/logs/1.log")
        makeFile("./jest-test/dist/2.log")
        makeFile("./jest-test/bin/3.log")
        makeFile("./jest-test/tim/4.log")
        makeFile("./jest-test/bin/tim/5.log")
        expect(isExisting("./jest-test/0.log")).toBeTruthy()
        expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()
        expect(isExisting("./jest-test/tim/4.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/tim/5.log")).toBeTruthy()

        execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/tim/*.log", {
            stdio: "inherit",
        })
        expect(isExisting("./jest-test/0.log")).toBeTruthy()        
        expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
        expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()
        expect(isExisting("./jest-test/tim/4.log")).toBeTruthy()
        expect(isExisting("./jest-test/bin/tim/5.log")).toBeFalsy()
    })
})

describe("Conduct dry run", () => {    
    describe("Delete folders", () => {
        test("Should delete a folder", async () => {
            makeFolder("./jest-test/dist")
            expect(isExisting("./jest-test/dist")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/dist --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/dist")).toBeTruthy()
        })
    
        test("Should delete a sub folder under a folder", async () => {
            makeFolder("./jest-test/dist")
            makeFolder("./jest-test/dist/bin")
            expect(isExisting("./jest-test/dist/bin")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/dist/bin --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/dist/bin")).toBeTruthy()
        })
    })
    
    describe("Delete files", () => {
        test("Should delete a file", async () => {
            makeFile("./jest-test/abc.log")
            expect(isExisting("./jest-test/abc.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/abc.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/abc.log")).toBeTruthy()
        })
    
        test("Should delete a file under a folder", async () => {
            makeFolder("./jest-test/logs")
            makeFile("./jest-test/logs/def.log")
            expect(isExisting("./jest-test/logs/def.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/logs/def.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/logs/def.log")).toBeTruthy()
        })
    
        test("Should delete files with wildcard", async () => {
            for (let i = 0 ; i < 10 ; i++) {
                makeFile(`./jest-test/${i}.log`)
            }
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./jest-test/${i}.log`)).toBeTruthy()
            }
            
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/*.log --dry-run", {
                stdio: "inherit",
            })
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./jest-test/${i}.log`)).toBeTruthy()
            }
        })
    
        test("Should delete files with wildcard in a sub folder", async () => {
            for (let i = 0 ; i < 10 ; i++) {
                makeFile(`./jest-test/logs/${i}.log`)
            }
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./jest-test/logs/${i}.log`)).toBeTruthy()
            }
            
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/logs/*.log --dry-run", {
                stdio: "inherit",
            })
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./jest-test/logs/${i}.log`)).toBeTruthy()
            }
        })
    })
    
    describe("Delete directories in the nested directories", () => {
        test("Should delete a folder under the nested folders", async () => {
            makeFolder("./jest-test/bin")
            makeFolder("./jest-test/nest")
            makeFolder("./jest-test/nest/bin")
            makeFolder("./jest-test/nest/dist")
            makeFolder("./jest-test/nest/dist/bin")
            expect(isExisting("./jest-test/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/dist/bin")).toBeTruthy()
    
            execSync('ts-node -r tsconfig-paths/register src/ts-clean.ts "jest-test/**/bin" --dry-run', {
                stdio: "inherit",
            })
    
            expect(isExisting("./jest-test/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/dist/bin")).toBeTruthy()
        })
    
        test("Should delete a sub folder under the nested folders", async () => {
            makeFolder("./jest-test/bin")
            makeFolder("./jest-test/pub")
            makeFolder("./jest-test/pub/bin")
    
            makeFolder("./jest-test/nest")
            makeFolder("./jest-test/nest/bin")
            makeFolder("./jest-test/nest/lib")
            makeFolder("./jest-test/nest/lib/bin")
            makeFolder("./jest-test/nest/lib/pub")
            makeFolder("./jest-test/nest/lib/pub/bin")
            makeFolder("./jest-test/nest/pub")
            makeFolder("./jest-test/nest/pub/bin")
    
            expect(isExisting("./jest-test/bin")).toBeTruthy()
            expect(isExisting("./jest-test/pub/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/pub/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/lib/pub/bin")).toBeTruthy()
            
            execSync('ts-node -r tsconfig-paths/register src/ts-clean.ts "jest-test/**/pub/bin" --dry-run', {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/bin")).toBeTruthy()
            expect(isExisting("./jest-test/pub/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/lib/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/pub/bin")).toBeTruthy()
            expect(isExisting("./jest-test/nest/lib/pub/bin")).toBeTruthy()
        })
    })
    
    describe("Delete files in the nested directories", () => {
        test("Should delete a file in the nested folders", async () => {
            makeFolder("./jest-test/logs")
            makeFolder("./jest-test/dist")
            makeFolder("./jest-test/bin")
            makeFile("./jest-test/0.log")
            makeFile("./jest-test/logs/0.log")
            makeFile("./jest-test/dist/0.log")
            makeFile("./jest-test/bin/0.log")
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/0.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
        })
    
        test("Should delete a file in a folder in the nested folder", async () => {
            makeFolder("./jest-test/logs")
            makeFolder("./jest-test/dist")
            makeFolder("./jest-test/bin")
            makeFolder("./jest-test/tim")
            makeFolder("./jest-test/bin/tim")
            makeFile("./jest-test/0.log")
            makeFile("./jest-test/logs/0.log")
            makeFile("./jest-test/dist/0.log")
            makeFile("./jest-test/bin/0.log")
            makeFile("./jest-test/tim/0.log")
            makeFile("./jest-test/bin/tim/0.log")
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/tim/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/tim/0.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/tim/0.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/0.log")).toBeTruthy()        
            expect(isExisting("./jest-test/logs/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/tim/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/tim/0.log")).toBeTruthy()
        })
    
        test("Should delete files with wildcard in the nested folders", async () => {
            makeFolder("./jest-test/logs")
            makeFolder("./jest-test/dist")
            makeFolder("./jest-test/bin")
            makeFile("./jest-test/0.log")
            makeFile("./jest-test/logs/1.log")
            makeFile("./jest-test/dist/2.log")
            makeFile("./jest-test/bin/3.log")
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/*.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()        
        })
    
        test("Should delete files in a folder with wildcard in the nested folders", async () => {
            makeFolder("./jest-test/logs")
            makeFolder("./jest-test/dist")
            makeFolder("./jest-test/bin")
            makeFolder("./jest-test/tim")
            makeFolder("./jest-test/bin/tim")
            makeFile("./jest-test/0.log")
            makeFile("./jest-test/logs/1.log")
            makeFile("./jest-test/dist/2.log")
            makeFile("./jest-test/bin/3.log")
            makeFile("./jest-test/tim/4.log")
            makeFile("./jest-test/bin/tim/5.log")
            expect(isExisting("./jest-test/0.log")).toBeTruthy()
            expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()
            expect(isExisting("./jest-test/tim/4.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/tim/5.log")).toBeTruthy()
    
            execSync("ts-node -r tsconfig-paths/register src/ts-clean.ts jest-test/**/tim/*.log --dry-run", {
                stdio: "inherit",
            })
            expect(isExisting("./jest-test/0.log")).toBeTruthy()        
            expect(isExisting("./jest-test/logs/1.log")).toBeTruthy()
            expect(isExisting("./jest-test/dist/2.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/3.log")).toBeTruthy()
            expect(isExisting("./jest-test/tim/4.log")).toBeTruthy()
            expect(isExisting("./jest-test/bin/tim/5.log")).toBeTruthy()
        })
    })    
})
