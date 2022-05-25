import fs from 'fs'
import path from 'path'
import { TextColour } from './log'
import { ARG_START_POINT } from './utils'

interface Arguments {
  files: string[],
  isCleanInstallOn?: boolean,
}

const REGEX_NESTED_DIRECTORY = new RegExp("(.)?\\*\\*\\/.")
const REGEX_WILDCARD_NAME = new RegExp("[a-zA-Z0-9_\\-\\/]*(\\*\\.).*")
const DEFAULT_PATHS_TO_DELETE = [
  "*.tsbuildinfo",
  "lib",
  "dist",
  "yarn-error.log",
]
const DEFAULT_INSTALL_TO_DELETE = [
  "node_modules",
]

const rootPath = process.cwd()

const parseArgv = (argv: string[]): Arguments => {
  const result: Arguments = {files: []}

  argv.forEach(arg => {
    if (arg === "-i" || arg === "--installed") {
      result.isCleanInstallOn = true
    } else if (!arg.startsWith("-")) {
      result.files.push(arg)
    }
  })

  return result
}

const isExisting = (dirOrFile: string): boolean => {
  return fs.existsSync(dirOrFile)
}

const isDirectory = (dirOrFile: string): boolean => {
  return fs.lstatSync(dirOrFile).isDirectory()
}

const isFile = (dirOrFile: string): boolean => {
  return fs.lstatSync(dirOrFile).isFile()
}

const isDotDot = (dirOrFile: string): boolean => {
  return (dirOrFile === '.' || dirOrFile === '..')
}

const listSubDirectories = (dir: string): string[] => {
  if (isFile(dir)) {
    return []
  }

  return fs.readdirSync(dir)
           .map(dirname => path.resolve(dir, dirname))
           .filter(dirPath => !isDotDot(dirPath) && isDirectory(dirPath))
}

const deleteFileOrDirectory = (dirOrFile: string) => {
  console.log(`To delete ${dirOrFile}`)
  if (!isExisting(dirOrFile)) {
    return
  }

  // TODO: Uncomment after test completed
  // fs.rmSync(dirOrFile, {
  //   force: true,
  //   recursive: true
  // })
  console.log(`[Delete] ${TextColour.Red}${dirOrFile}${TextColour.Default} has been deleted`)
}

const cleanSubdirectoriesAndFiles = (dir: string, toDelete: string[]) => {
  const toDeleteNext: string[] = []

  toDelete.forEach(target => {    
    if (REGEX_NESTED_DIRECTORY.test(target)) {      
      const targetBasename = path.basename(target)
      const targetPath = path.resolve(dir, targetBasename)
      deleteFileOrDirectory(targetPath)

      toDeleteNext.push(target)
    } else if (REGEX_WILDCARD_NAME.test(target)) {
      deleteFileOrDirectory(target)
    } else {
      const targetPath = path.resolve(dir, target)
      deleteFileOrDirectory(targetPath)
    }
  })

  if (toDeleteNext.length <= 0) {
    return
  }
  
  listSubDirectories(dir).forEach(subDir => {
    cleanSubdirectoriesAndFiles(subDir, toDeleteNext)
  })
}

const printHelp = () => {
  const help:string[] = [
    "ts-clean is a tiddy tool to clean up typescript project without duplicating clean scripts",
    "flooding over the workspace. ts-clean has built-in default files and directories which should",
    "be cleaned in each build and also it could clean the `node_modules` folders in the yarn ",
    "workspace. Additional files or directories can be specified in the command line prompt",
    "to delete.",
    "Defualt to clean up:",
    `   ${TextColour.Green}*.tsbuildinfo${TextColour.Default}`,
    `   ${TextColour.Green}lib${TextColour.Default}`,
    `   ${TextColour.Green}dist${TextColour.Default}`,
    `   ${TextColour.Green}yarn-error.log${TextColour.Default}`,
    "",
    "",
    "Command:",
    "   ts-clean [Options] [files] ...",
    "",
    "Files:",
    "ts-clean supports `nested directory` syntax, it means you can clean up a particular",
    "file or directory recursively.",
    "For example, to clean up `node_modules` folder in a yarn workspace, you could enter:",
    `   ${TextColour.Green}\${workspaceName}/**/node_modules${TextColour.Default}`,
    "If you would like to clean up multipe files against the file extention name",
    "For instance, to clean up log files, you could enter:",
    `   ${TextColour.Green}*.log${TextColour.Default}`,
    "Wildcard also can be used with nested directories as follows:",
    `   ${TextColour.Green}\${workspaceName}/**/*.log${TextColour.Default}`,
    "",
    "Options:",
    "   -i or --installed:  To clean up `node_modules` directory in current folder",
    "   -h or --help:       To show up descriptions",
  ]

  console.log(help.join("\n"))
}

const argv: Arguments = parseArgv(process.argv.slice(ARG_START_POINT))

if (!argv.files || argv.files.length <= 0) {
  printHelp()
} else {
  let defaults = []

  if (argv.isCleanInstallOn) {
    defaults = DEFAULT_INSTALL_TO_DELETE
  } else {
    defaults = DEFAULT_PATHS_TO_DELETE
  }

  const filesOrDirsToDelete = [
    ...defaults,
    ...argv.files || [],
  ]
    
  console.log(`Starts to clean directories and files from ${rootPath}\n`)
  cleanSubdirectoriesAndFiles(rootPath, filesOrDirsToDelete.filter((item, index, array) => array.indexOf(item) === index))
}
