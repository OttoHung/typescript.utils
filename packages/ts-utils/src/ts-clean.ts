import fs from 'fs'
import path from 'path'
import { TextColour } from './log'
import { ARG_START_POINT } from './utils'

interface Argument {
    name: string,
    value: string
}

interface Arguments {
    excludes?: string[],
    files: string[],
    isCleanInstallOn?: boolean,
    isHelp?: boolean,
    isDryRun?: boolean,
}

interface Commmands {
    [key: string]: string[]
}

enum Command {
    DryRun      = "DryRun",
    Exclude     = "Exclude",
    Help        = "Help",
    Installed   = "Installed",    
}

const supportedCommands: Commmands = {
    [Command.Exclude]: ["-e","--exclude"],
    [Command.DryRun]: ["--dry-run"],  
    [Command.Help]: ["-h", "--help"],
    [Command.Installed]: ["-i", "--installed"],
}

const NESTED_DIRECTORY_PATH = "**/"
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

const parseArg = (arg: string): Argument => {
    const equalIndex = arg.toLocaleLowerCase().indexOf("=")

    return {
        name: (equalIndex > 0) ? arg.slice(0, equalIndex) : arg,
        value: (equalIndex > 0) ? arg.slice(equalIndex+1) : "",
    }
}

const parseArgv = (argv: string[]): Arguments => {
  const result: Arguments = {files: []}

  argv.forEach(arg => {
    const {name, value} = parseArg(arg)

    if (supportedCommands[Command.Installed].includes(name)) {
        result.isCleanInstallOn = true
    } else if (supportedCommands[Command.Help].includes(name)) {
        result.isHelp = true
    } else if (supportedCommands[Command.DryRun].includes(name)) {
        result.isDryRun = true
    } else if (supportedCommands[Command.Exclude].includes(name)) {
        if (result.excludes === undefined) {
            result.excludes = []
        }
        result.excludes.push(value)
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

const deleteFileOrDirectory = (dirOrFile: string, isDryRun: boolean) => {
    if (!REGEX_WILDCARD_NAME.test(dirOrFile) && !isExisting(dirOrFile)) {
        return
    }

    if (isDryRun) {
        console.log(`[Dry Run] ${TextColour.Red}${dirOrFile}${TextColour.Default} will been deleted without '--dry-run'`)
    } else {
        fs.rmSync(dirOrFile, {
            force: true,
            recursive: true
        })
        console.log(`[Delete] ${TextColour.Red}${dirOrFile}${TextColour.Default} has been deleted`)
    }
    
}

const deleteSubFilesOrDirectories = (dir: string, targetBasename: string, isDryRun: boolean, excludes?: string[]) => {
    listSubDirectories(dir).forEach(subDir => {
        const targetDir = path.resolve(subDir, targetBasename)
        if (excludes === undefined) {
            deleteFileOrDirectory(targetDir, isDryRun)
        } else {            
            excludes.forEach( exclude => {
                if (!targetDir.endsWith(exclude)) {
                    deleteFileOrDirectory(targetDir, isDryRun)
                }
            })
        }

        deleteSubFilesOrDirectories(subDir, targetBasename, isDryRun, excludes)
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
    `   ts-clean "${TextColour.Green}\${workspaceName}/**/node_modules${TextColour.Default}"`,
    "If you would like to clean up multipe files against the file extention name",
    "For instance, to clean up log files, you could enter:",
    `   ts-clean ${TextColour.Green}*.log${TextColour.Default}`,
    "Wildcard also can be used with nested directories as follows:",
    `   ts-clean ${TextColour.Green}\${workspaceName}/**/*.log${TextColour.Default}`,
    "",
    "Options:",
    "   -i or --installed:  To clean up `node_modules` directory in current folder",
    "   -h or --help:       To show up descriptions.",
    "   --dry-run:          Run clean up process but does not delete any file and directory.",
    "                       Normally, this option is used when you want to confirm what file",
    "                       and directory will be deleted."
  ]

  console.log(help.join("\n"))
}

const argv: Arguments = parseArgv(process.argv.slice(ARG_START_POINT))

if (argv.isHelp) {
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
  const noDuplicatedFilesOrDirs = filesOrDirsToDelete.filter((item, index, array) => array.indexOf(item) === index)
  const isDryRun = argv.isDryRun ?? false

  noDuplicatedFilesOrDirs.forEach(fileOrDirToDelete => {
    if (REGEX_NESTED_DIRECTORY.test(fileOrDirToDelete)) {
      const dir = path.resolve(rootPath, fileOrDirToDelete.slice(0, fileOrDirToDelete.indexOf(NESTED_DIRECTORY_PATH)-1).replace(".", ""))      
      const targetBasename = fileOrDirToDelete.substring(fileOrDirToDelete.indexOf(NESTED_DIRECTORY_PATH)+NESTED_DIRECTORY_PATH.length)
      deleteSubFilesOrDirectories(dir, targetBasename, isDryRun, argv.excludes)
    } else {
      const targetPath = path.resolve(rootPath, fileOrDirToDelete)
      deleteFileOrDirectory(targetPath, isDryRun)
    }
  })
}
