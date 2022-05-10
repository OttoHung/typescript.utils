import fs from 'fs'
import path from 'path'
import { TextColour } from './log'
import { ARG_START_POINT } from './utils'

const filesOrFolderToDelete = process.argv.slice(ARG_START_POINT)
const rootPath = path.dirname(__dirname)

const isDirectory = (dirOrFile: string): boolean => {
  return fs.lstatSync(dirOrFile).isDirectory()
}

const isDotDot = (dirOrFile: string): boolean => {
  return (dirOrFile === '.' || dirOrFile === '..')
}

const listSubDirectoriesAndFiles = (dirOrFile: string): string[] => {
  return fs.readdirSync(dirOrFile)
    .map(dirName => path.resolve(dirOrFile, dirName))
    .filter(file => !isDotDot(file))
}

const deleteFileOrDirectories = (file: string) => {
  fs.rmSync(file, {
    force: true,
    recursive: true
  })
  console.log(`[Delete] ${TextColour.Red}${file}${TextColour.Default} has been deleted`)
}

const deleteDirectoriesAndFiles = (rootDir: string, directoryOrFileName: string) => {
  listSubDirectoriesAndFiles(rootDir).forEach(dir => {
    if (!path.basename(rootDir).startsWith(".") && isDirectory(rootDir) && !isDotDot(rootDir) && directoryOrFileName.includes("/**/")) {
      deleteDirectoriesAndFiles(dir, directoryOrFileName)
    } else if (new RegExp(directoryOrFileName.replace("*", "\\*").replace("/", "\\/")).test(path.basename(dir))) {
      deleteFileOrDirectories(dir)
    }
  })
}

if (filesOrFolderToDelete === undefined) {
  console.log("No files nor directories were assigned to deleted")
} else {
  filesOrFolderToDelete.forEach(fileOrFolder => {
    deleteDirectoriesAndFiles(rootPath, fileOrFolder)
  })
}
