const path = require('path');
const vueJsx = require('@vitejs/plugin-vue-jsx');
const fs = require('fs');
const fsExtra = require('fs-extra');

const { build, defineConfig } = require('vite');

const vue = require('@vitejs/plugin-vue');
const dts = require('vite-plugin-dts');
const DefineOptions = require('unplugin-vue-define-options/vite');

const rootDir = path.resolve(__dirname, '../');
const outDir = resolve('lib/dist');
const entryDir = resolve('components');
const rollupOptions = {
  external: ['vue', 'vue-router', 'element-plus', 'pinia', '@hb/hb-services'],
  output: {
    globals: {
      vue: 'Vue'
    }
  }
};
const baseConfig = defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "../components/styles/elements/index.scss"as *;`
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    DefineOptions(),
    dts({
      include: ['packages/ui-plus', 'packages/components'],
      outputDir: path.resolve(outDir, 'types')
    })
  ],
  build: {
    rollupOptions,
    lib: {
      entry: resolve(entryDir, 'index.ts'),
      name: 'ui-plus',
      fileName: (format) => `ui-plus.${format}.js`,
      formats: ['es', 'umd']
    },
    outDir
  }
});

async function copyFiles() {
  fs.copyFileSync(resolve('README.md'), resolve('lib/README.md'));
}

function resolve(...urlOrUrls) {
  return path.resolve(rootDir, ...urlOrUrls);
}

async function buildAll() {
  await build(baseConfig);

  await copyFiles();
}

const buildSingle = async (name) => {
  await build({
    ...baseConfig,
    build: {
      rollupOptions,
      lib: {
        entry: resolve(entryDir, name),
        name: 'index',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'umd']
      },
      outDir: resolve(outDir, name)
    }
  });
};
const createPackageJson = (name) => {
  const fileStr = `
        {
            "name": "${name}",
            "main": "index.umd.js",
            "module": "index.es.js",
            "style": "styles.css" 
        }
    `;
  fsExtra.outputFile(
    path.resolve(outDir, `${name}/package.json`),
    fileStr,
    'utf-8'
  );
};

//添加自定义前缀;eg: .el-换成.wm-
const addChangePrefix = () => {
  let changeprefix = process.argv[2];
  try {
    const regex = /\.el-/g;
    const regex1 = /\--el-/g;
    const data = fs.readFileSync(path.resolve(outDir, `style.css`), 'utf8');
    let newData = data.replace(regex, `.${changeprefix}-`);
    newData = newData.replace(regex1, `--${changeprefix}-`);
    fs.writeFileSync(path.resolve(outDir, `style.css`), newData, 'utf8');
    console.log('修改样式前缀成功-------');
  } catch (error) {
    console.log(error);
  }
};

const buildLib = async () => {
  // console.log('---------',process.env.npm_lifecycle_event)
  await buildAll();

  const components = fs.readdirSync(entryDir).filter((name) => {
    const componentDir = path.resolve(entryDir, name);
    const isDir = fs.lstatSync(componentDir).isDirectory();
    return isDir && fs.readdirSync(componentDir).includes('index.ts');
  });

  for (const name of components) {
    await buildSingle(name);
    createPackageJson(name);
  }
  if(process.env.npm_lifecycle_event.includes('build:')){
    await addChangePrefix()
  }
};

buildLib();
