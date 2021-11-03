import { ConfigPlugin, withMainApplication } from '@expo/config-plugins';

const ANDROID_IMPORT_LEANPLUM = 'com.leanplum.Leanplum';
const ANDROID_IMPORT_LEANPLUM_ACTIVITY_HELPER = 'com.leanplum.LeanplumActivityHelper';
const LEANPLUM_ONCREATE_INIT = `
    Leanplum.setApplicationContext(this);
    Parser.parseVariables(this);
    LeanplumActivityHelper.enableLifecycleCallbacks(this);
`;

function addJavaImports(javaSource: string, javaImports: string[]): string {
    const lines = javaSource.split('\n');
    const lineIndexWithPackageDeclaration = lines.findIndex((line) => line.match(/^package .*;$/));
    for (const javaImport of javaImports) {
      if (!javaSource.includes(javaImport)) {
        const importStatement = `import ${javaImport};`;
        lines.splice(lineIndexWithPackageDeclaration + 1, 0, importStatement);
      }
    }
    return lines.join('\n');
}

function addOnCreate(javaSource: string, javaInsert: string): string {
    const lines = javaSource.split('\n');
    const onCreateIndex = lines.findIndex((line) => line.match(/super\.onCreate\(\);/));
    lines.splice(onCreateIndex + 1, 0, javaInsert);
    return lines.join('\n');
}

const withLeanplumSDK: ConfigPlugin = (config) => {
    return withMainApplication(config, (config) => {
        if (config.modResults.language === 'java') {
            let content = config.modResults.contents;
            content = addJavaImports(content, [ANDROID_IMPORT_LEANPLUM, ANDROID_IMPORT_LEANPLUM_ACTIVITY_HELPER]);
            content = addOnCreate(content, LEANPLUM_ONCREATE_INIT);
            config.modResults.contents = content;
        }
        return config
    });
};

export default withLeanplumSDK;