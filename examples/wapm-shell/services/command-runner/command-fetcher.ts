// Service to fetch and instantiate modules
// And cache them to run again

import WapmTty from "../wapm-terminal/wapm-tty/wapm-tty";

import wasmInit, {
  lower_i64_imports
} from "../../assets/wasi-js-transformer/wasi_js_transformer";
// @ts-ignore
import wasmJsTransformerWasmUrl from "../../assets/wasi-js-transformer/wasi_js_transformer_bg.wasm";

// @ts-ignore
import stdinWasmUrl from "../../assets/stdin.wasm";
// @ts-ignore
import clockTimeGetUrl from "../../assets/clock_time_get.wasm";
// @ts-ignore
import pathOpenGetUrl from "../../assets/path_open.wasm";
// @ts-ignore
import twoImportsUrl from "../../assets/two-imports.wasm";
// @ts-ignore
import quickJsUrl from "../../assets/qjs.wasm";
// @ts-ignore
import dukTapeUrl from "../../assets/duk.wasm";
// @ts-ignore
import argtestUrl from "../../assets/argtest.wasm";
// @ts-ignore
import gettimeofdayUrl from "../../assets/gettimeofday.wasm";

let commandToUrlCache: { [key: string]: string } = {
  a: stdinWasmUrl,
  c: clockTimeGetUrl,
  p: pathOpenGetUrl,
  g: gettimeofdayUrl,
  qjs: quickJsUrl,
  duk: dukTapeUrl,
  two: twoImportsUrl,
  arg: argtestUrl
};
let compiledModulesCache: { [key: string]: WebAssembly.Module } = {};

const WAPM_GRAPHQL_QUERY = `query shellGetCommandQuery($command: String!) {
  command: getCommand(name: $command) {
    command
    module {
      abi
      publicUrl
    }
    packageVersion {
      package {
        displayName
      }
    }
  }
}`;

const getWapmUrlForCommandName = async (commandName: String) => {
  return await fetch("https://registry.wapm.io/graphql", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: "shellGetCommandQuery",
      query: WAPM_GRAPHQL_QUERY,
      variables: {
        command: commandName
      }
    })
  })
    .then(response => response.json())
    .then(response => {
      const optionalChaining = (baseObject: any, chain: Array<string>): any => {
        const newObject = baseObject[chain[0]];
        chain.shift();
        if (newObject) {
          if (chain.length > 1) {
            return optionalChaining(newObject, chain);
          }

          return true;
        }
        return false;
      };

      if (
        optionalChaining(response, ["data", "command", "module", "publicUrl"])
      ) {
        const wapmModule = response.data.command.module;

        if (wapmModule.abi !== "wasi") {
          throw new Error(
            `${commandName} does not use the wasi abi. Currently, only the wasi abi is supported on the wapm shell.`
          );
        }

        return wapmModule.publicUrl;
      } else {
        throw new Error(`command not found ${commandName}`);
      }
    });
};

const getWasmModuleFromUrl = async (
  url: string,
  commandName?: string,
  wapmTty?: WapmTty
): Promise<WebAssembly.Module> => {
  // @ts-ignore
  if (WebAssembly.compileStreaming && false) {
    // @ts-ignore
    return await WebAssembly.compileStreaming(fetch(url));
  } else {
    let fetched = await fetch(url);
    let buffer = await fetched.arrayBuffer();
    let binary = new Uint8Array(buffer);

    if (commandName && wapmTty) {
      // Restore the cursor position
      wapmTty.print("\u001b[u");

      // Clear from cursor to end of screen
      wapmTty.print("\u001b[1000D");
      wapmTty.print("\u001b[0J");

      wapmTty.print(`[INFO] Doing Transformations for "${commandName}"`);
    }

    // Make Modifications to the binary to support browser side WASI.
    await wasmInit(wasmJsTransformerWasmUrl);
    binary = lower_i64_imports(binary);

    const wasmModule = await WebAssembly.compile(binary);
    return wasmModule;
  }
};

export default class CommandFetcher {
  async getWasmModuleForCommandName(commandName: string, wapmTty?: WapmTty) {
    let commandUrl = commandToUrlCache[commandName];
    if (!commandUrl) {
      commandUrl = await getWapmUrlForCommandName(commandName);
      commandToUrlCache[commandName] = commandUrl;
    }

    let cachedData = compiledModulesCache[commandUrl];
    if (!cachedData) {
      if (wapmTty) {
        // Save the cursor position
        wapmTty.print("\u001b[s");

        wapmTty.print(
          `[INFO] Downloading "${commandName}" from "${commandUrl}"`
        );
      }

      // Fetch the wasm modules, but at least show the message for a short while
      cachedData = compiledModulesCache[commandUrl] = await Promise.all([
        getWasmModuleFromUrl(commandUrl, commandName, wapmTty),
        new Promise(resolve => setTimeout(resolve, 500))
      ]).then(responses => responses[0]);

      if (wapmTty) {
        // Restore the cursor position
        wapmTty.print("\u001b[u");

        // Clear from cursor to end of screen
        wapmTty.print("\u001b[1000D");
        wapmTty.print("\u001b[0J");
      }
    }

    return cachedData;
  }
}