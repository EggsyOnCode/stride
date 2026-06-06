const { withProjectBuildGradle } = require('@expo/config-plugins');

const NOTIFEE_MAVEN = `    maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`;

function withNotifeeMaven(config) {
  return withProjectBuildGradle(config, (gradle) => {
    if (!gradle.modResults.contents.includes('@notifee/react-native/android/libs')) {
      gradle.modResults.contents = gradle.modResults.contents.replace(
        /maven \{ url 'https:\/\/www\.jitpack\.io' \}/,
        `maven { url 'https://www.jitpack.io' }\n${NOTIFEE_MAVEN}`,
      );
    }
    return gradle;
  });
}

module.exports = withNotifeeMaven;
