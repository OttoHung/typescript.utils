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

const ROOT_NAME = "jest-test-js"
beforeAll(async () => {    
    execSync("yarn build", {
        stdio: "inherit",
    })

    makeFolder(ROOT_NAME)
})

afterAll(() => {
    deleteFolder(ROOT_NAME)
})

describe("Delete folders", () => {
    test("Should delete a folder", async () => {
        makeFolder(`./${ROOT_NAME}/dist`)
        expect(isExisting(`./${ROOT_NAME}/dist`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/dist`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/dist`)).toBeFalsy()
    })

    test("Should delete a sub folder under a folder", async () => {
        makeFolder(`./${ROOT_NAME}/dist`)
        makeFolder(`./${ROOT_NAME}/dist/bin`)
        expect(isExisting(`./${ROOT_NAME}/dist/bin`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/dist/bin`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/dist/bin`)).toBeFalsy()
    })
})

describe("Delete files", () => {
    test("Should delete a file", async () => {
        makeFile(`./${ROOT_NAME}/abc.log`)
        expect(isExisting(`./${ROOT_NAME}/abc.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/abc.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/abc.log`)).toBeFalsy()
    })

    test("Should delete a file under a folder", async () => {
        makeFolder(`./${ROOT_NAME}/logs`)
        makeFile(`./${ROOT_NAME}/logs/def.log`)
        expect(isExisting(`./${ROOT_NAME}/logs/def.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/logs/def.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/logs/def.log`)).toBeFalsy()
    })

    test("Should delete files with wildcard", async () => {
        for (let i = 0 ; i < 10 ; i++) {
            makeFile(`./${ROOT_NAME}/${i}.log`)
        }
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./${ROOT_NAME}/${i}.log`)).toBeTruthy()
        }
        
        execSync(`node dist/ts-clean.js ${ROOT_NAME}/*.log`, {
            stdio: "inherit",
        })
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./${ROOT_NAME}/${i}.log`)).toBeFalsy()
        }
    })

    test("Should delete files with wildcard in a sub folder", async () => {
        for (let i = 0 ; i < 10 ; i++) {
            makeFile(`./${ROOT_NAME}/logs/${i}.log`)
        }
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./${ROOT_NAME}/logs/${i}.log`)).toBeTruthy()
        }
        
        execSync(`node dist/ts-clean.js ${ROOT_NAME}/logs/*.log`, {
            stdio: "inherit",
        })
        for (let i = 0 ; i < 10 ; i++) {
            expect(isExisting(`./${ROOT_NAME}/logs/${i}.log`)).toBeFalsy()
        }
    })
})

describe("Delete directories in the nested directories", () => {
    test("Should delete a folder under the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/dist`)
        makeFolder(`./${ROOT_NAME}/nest/dist/bin`)
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()

        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/bin"`, {
            stdio: "inherit",
        })

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeFalsy()
    })

    test("Should delete a sub folder under the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/pub`)
        makeFolder(`./${ROOT_NAME}/pub/bin`)

        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib`)
        makeFolder(`./${ROOT_NAME}/nest/lib/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub/bin`)
        makeFolder(`./${ROOT_NAME}/nest/pub`)
        makeFolder(`./${ROOT_NAME}/nest/pub/bin`)

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
        
        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/pub/bin"`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeFalsy()
    })
})

describe("Delete files in the nested directories", () => {
    test("Should delete a file in the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/logs`)
        makeFolder(`./${ROOT_NAME}/dist`)
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFile(`./${ROOT_NAME}/0.log`)
        makeFile(`./${ROOT_NAME}/logs/0.log`)
        makeFile(`./${ROOT_NAME}/dist/0.log`)
        makeFile(`./${ROOT_NAME}/bin/0.log`)
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/0.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeFalsy()
    })

    test("Should delete a file in a folder in the nested folder", async () => {
        makeFolder(`./${ROOT_NAME}/logs`)
        makeFolder(`./${ROOT_NAME}/dist`)
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/tim`)
        makeFolder(`./${ROOT_NAME}/bin/tim`)
        makeFile(`./${ROOT_NAME}/0.log`)
        makeFile(`./${ROOT_NAME}/logs/0.log`)
        makeFile(`./${ROOT_NAME}/dist/0.log`)
        makeFile(`./${ROOT_NAME}/bin/0.log`)
        makeFile(`./${ROOT_NAME}/tim/0.log`)
        makeFile(`./${ROOT_NAME}/bin/tim/0.log`)
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/tim/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/tim/0.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/tim/0.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()        
        expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/tim/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/tim/0.log`)).toBeFalsy()
    })

    test("Should delete files with wildcard in the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/logs`)
        makeFolder(`./${ROOT_NAME}/dist`)
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFile(`./${ROOT_NAME}/0.log`)
        makeFile(`./${ROOT_NAME}/logs/1.log`)
        makeFile(`./${ROOT_NAME}/dist/2.log`)
        makeFile(`./${ROOT_NAME}/bin/3.log`)
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/*.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeFalsy()        
    })

    test("Should delete files in a folder with wildcard in the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/logs`)
        makeFolder(`./${ROOT_NAME}/dist`)
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/tim`)
        makeFolder(`./${ROOT_NAME}/bin/tim`)
        makeFile(`./${ROOT_NAME}/0.log`)
        makeFile(`./${ROOT_NAME}/logs/1.log`)
        makeFile(`./${ROOT_NAME}/dist/2.log`)
        makeFile(`./${ROOT_NAME}/bin/3.log`)
        makeFile(`./${ROOT_NAME}/tim/4.log`)
        makeFile(`./${ROOT_NAME}/bin/tim/5.log`)
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/tim/4.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/tim/5.log`)).toBeTruthy()

        execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/tim/*.log`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()        
        expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/tim/4.log`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/bin/tim/5.log`)).toBeFalsy()
    })
})

describe("Conduct dry run", () => {    
    describe("Delete folders", () => {
        test("Should delete a folder", async () => {
            makeFolder(`./${ROOT_NAME}/dist`)
            expect(isExisting(`./${ROOT_NAME}/dist`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/dist --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/dist`)).toBeTruthy()
        })
    
        test("Should delete a sub folder under a folder", async () => {
            makeFolder(`./${ROOT_NAME}/dist`)
            makeFolder(`./${ROOT_NAME}/dist/bin`)
            expect(isExisting(`./${ROOT_NAME}/dist/bin`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/dist/bin --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/dist/bin`)).toBeTruthy()
        })
    })
    
    describe("Delete files", () => {
        test("Should delete a file", async () => {
            makeFile(`./${ROOT_NAME}/abc.log`)
            expect(isExisting(`./${ROOT_NAME}/abc.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/abc.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/abc.log`)).toBeTruthy()
        })
    
        test("Should delete a file under a folder", async () => {
            makeFolder(`./${ROOT_NAME}/logs`)
            makeFile(`./${ROOT_NAME}/logs/def.log`)
            expect(isExisting(`./${ROOT_NAME}/logs/def.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/logs/def.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/logs/def.log`)).toBeTruthy()
        })
    
        test("Should delete files with wildcard", async () => {
            for (let i = 0 ; i < 10 ; i++) {
                makeFile(`./${ROOT_NAME}/${i}.log`)
            }
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./${ROOT_NAME}/${i}.log`)).toBeTruthy()
            }
            
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/*.log --dry-run`, {
                stdio: "inherit",
            })
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./${ROOT_NAME}/${i}.log`)).toBeTruthy()
            }
        })
    
        test("Should delete files with wildcard in a sub folder", async () => {
            for (let i = 0 ; i < 10 ; i++) {
                makeFile(`./${ROOT_NAME}/logs/${i}.log`)
            }
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./${ROOT_NAME}/logs/${i}.log`)).toBeTruthy()
            }
            
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/logs/*.log --dry-run`, {
                stdio: "inherit",
            })
            for (let i = 0 ; i < 10 ; i++) {
                expect(isExisting(`./${ROOT_NAME}/logs/${i}.log`)).toBeTruthy()
            }
        })
    })
    
    describe("Delete directories in the nested directories", () => {
        test("Should delete a folder under the nested folders", async () => {
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFolder(`./${ROOT_NAME}/nest`)
            makeFolder(`./${ROOT_NAME}/nest/bin`)
            makeFolder(`./${ROOT_NAME}/nest/dist`)
            makeFolder(`./${ROOT_NAME}/nest/dist/bin`)
            expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/bin" --dry-run`, {
                stdio: "inherit",
            })
    
            expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()
        })
    
        test("Should delete a sub folder under the nested folders", async () => {
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFolder(`./${ROOT_NAME}/pub`)
            makeFolder(`./${ROOT_NAME}/pub/bin`)
    
            makeFolder(`./${ROOT_NAME}/nest`)
            makeFolder(`./${ROOT_NAME}/nest/bin`)
            makeFolder(`./${ROOT_NAME}/nest/lib`)
            makeFolder(`./${ROOT_NAME}/nest/lib/bin`)
            makeFolder(`./${ROOT_NAME}/nest/lib/pub`)
            makeFolder(`./${ROOT_NAME}/nest/lib/pub/bin`)
            makeFolder(`./${ROOT_NAME}/nest/pub`)
            makeFolder(`./${ROOT_NAME}/nest/pub/bin`)
    
            expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
            
            execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/pub/bin" --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/lib/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
        })
    })
    
    describe("Delete files in the nested directories", () => {
        test("Should delete a file in the nested folders", async () => {
            makeFolder(`./${ROOT_NAME}/logs`)
            makeFolder(`./${ROOT_NAME}/dist`)
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFile(`./${ROOT_NAME}/0.log`)
            makeFile(`./${ROOT_NAME}/logs/0.log`)
            makeFile(`./${ROOT_NAME}/dist/0.log`)
            makeFile(`./${ROOT_NAME}/bin/0.log`)
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/0.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
        })
    
        test("Should delete a file in a folder in the nested folder", async () => {
            makeFolder(`./${ROOT_NAME}/logs`)
            makeFolder(`./${ROOT_NAME}/dist`)
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFolder(`./${ROOT_NAME}/tim`)
            makeFolder(`./${ROOT_NAME}/bin/tim`)
            makeFile(`./${ROOT_NAME}/0.log`)
            makeFile(`./${ROOT_NAME}/logs/0.log`)
            makeFile(`./${ROOT_NAME}/dist/0.log`)
            makeFile(`./${ROOT_NAME}/bin/0.log`)
            makeFile(`./${ROOT_NAME}/tim/0.log`)
            makeFile(`./${ROOT_NAME}/bin/tim/0.log`)
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/tim/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/tim/0.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/tim/0.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()        
            expect(isExisting(`./${ROOT_NAME}/logs/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/tim/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/tim/0.log`)).toBeTruthy()
        })
    
        test("Should delete files with wildcard in the nested folders", async () => {
            makeFolder(`./${ROOT_NAME}/logs`)
            makeFolder(`./${ROOT_NAME}/dist`)
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFile(`./${ROOT_NAME}/0.log`)
            makeFile(`./${ROOT_NAME}/logs/1.log`)
            makeFile(`./${ROOT_NAME}/dist/2.log`)
            makeFile(`./${ROOT_NAME}/bin/3.log`)
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/*.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()        
        })
    
        test("Should delete files in a folder with wildcard in the nested folders", async () => {
            makeFolder(`./${ROOT_NAME}/logs`)
            makeFolder(`./${ROOT_NAME}/dist`)
            makeFolder(`./${ROOT_NAME}/bin`)
            makeFolder(`./${ROOT_NAME}/tim`)
            makeFolder(`./${ROOT_NAME}/bin/tim`)
            makeFile(`./${ROOT_NAME}/0.log`)
            makeFile(`./${ROOT_NAME}/logs/1.log`)
            makeFile(`./${ROOT_NAME}/dist/2.log`)
            makeFile(`./${ROOT_NAME}/bin/3.log`)
            makeFile(`./${ROOT_NAME}/tim/4.log`)
            makeFile(`./${ROOT_NAME}/bin/tim/5.log`)
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/tim/4.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/tim/5.log`)).toBeTruthy()
    
            execSync(`node dist/ts-clean.js ${ROOT_NAME}/**/tim/*.log --dry-run`, {
                stdio: "inherit",
            })
            expect(isExisting(`./${ROOT_NAME}/0.log`)).toBeTruthy()        
            expect(isExisting(`./${ROOT_NAME}/logs/1.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/dist/2.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/3.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/tim/4.log`)).toBeTruthy()
            expect(isExisting(`./${ROOT_NAME}/bin/tim/5.log`)).toBeTruthy()
        })
    })    
})

describe("Conduct exclude option", () => {
    test("Should not delete a particular folder under the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/dist`)
        makeFolder(`./${ROOT_NAME}/nest/dist/bin`)
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()

        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/bin" --exclude=dist/bin`, {
            stdio: "inherit",
        })

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()
    })

    test("Should not delete a particular folder under the nested folders in shorten option", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/dist`)
        makeFolder(`./${ROOT_NAME}/nest/dist/bin`)
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()

        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/bin" -e=dist/bin`, {
            stdio: "inherit",
        })

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/dist/bin`)).toBeTruthy()
    })

    test("Should delete a sub folder under the nested folders", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/pub`)
        makeFolder(`./${ROOT_NAME}/pub/bin`)

        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib`)
        makeFolder(`./${ROOT_NAME}/nest/lib/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub/bin`)
        makeFolder(`./${ROOT_NAME}/nest/pub`)
        makeFolder(`./${ROOT_NAME}/nest/pub/bin`)

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
        
        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/pub/bin" --exclude=lib/pub/bin`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
    })

    test("Should delete a sub folder under the nested folders in shorten option", async () => {
        makeFolder(`./${ROOT_NAME}/bin`)
        makeFolder(`./${ROOT_NAME}/pub`)
        makeFolder(`./${ROOT_NAME}/pub/bin`)

        makeFolder(`./${ROOT_NAME}/nest`)
        makeFolder(`./${ROOT_NAME}/nest/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib`)
        makeFolder(`./${ROOT_NAME}/nest/lib/bin`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub`)
        makeFolder(`./${ROOT_NAME}/nest/lib/pub/bin`)
        makeFolder(`./${ROOT_NAME}/nest/pub`)
        makeFolder(`./${ROOT_NAME}/nest/pub/bin`)

        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
        
        execSync(`node dist/ts-clean.js "${ROOT_NAME}/**/pub/bin" -e=lib/pub/bin`, {
            stdio: "inherit",
        })
        expect(isExisting(`./${ROOT_NAME}/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/pub/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/bin`)).toBeTruthy()
        expect(isExisting(`./${ROOT_NAME}/nest/pub/bin`)).toBeFalsy()
        expect(isExisting(`./${ROOT_NAME}/nest/lib/pub/bin`)).toBeTruthy()
    })
})

describe("Conduct recommend option", () => {
    test("Should dist folder be deleted when --recommend given", async() => {
        makeFile("1.tsbuildinfo")
        makeFolder("lib")
        makeFile("yarn-error.log")
        execSync("yarn build", {
            stdio: "inherit",
        })
        expect(isExisting("1.tsbuildinfo")).toBeTruthy()
        expect(isExisting("lib")).toBeTruthy()
        expect(isExisting("dist")).toBeTruthy()
        expect(isExisting("yarn-error.log")).toBeTruthy()
    
        execSync(`node dist/ts-clean.js --recommend`, {
            stdio: "inherit",
        })
        expect(isExisting("1.tsbuildinfo")).toBeFalsy()
        expect(isExisting("lib")).toBeFalsy()
        expect(isExisting("dist")).toBeFalsy()
        expect(isExisting("yarn-error.log")).toBeFalsy()
    })
    
    test("Should dist folder be deleted when -r given", async() => {
        makeFile("1.tsbuildinfo")
        makeFolder("lib")
        makeFile("yarn-error.log")
        execSync("yarn build", {
            stdio: "inherit",
        })
        expect(isExisting("1.tsbuildinfo")).toBeTruthy()
        expect(isExisting("lib")).toBeTruthy()
        expect(isExisting("dist")).toBeTruthy()
        expect(isExisting("yarn-error.log")).toBeTruthy()
    
        execSync(`node dist/ts-clean.js -r`, {
            stdio: "inherit",
        })
        expect(isExisting("1.tsbuildinfo")).toBeFalsy()
        expect(isExisting("lib")).toBeFalsy()
        expect(isExisting("dist")).toBeFalsy()
        expect(isExisting("yarn-error.log")).toBeFalsy()
    })
})
