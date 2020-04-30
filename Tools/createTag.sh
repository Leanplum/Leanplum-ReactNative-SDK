#!/bin/bash

function incrementBetaNumber() {
	source Tools/semver.sh  

	local MAJOR=0
	local MINOR=0
	local PATCH=0
	local SPECIAL=""

	semverParseInto `cat sdk-version.txt` MAJOR MINOR PATCH SPECIAL
	if [ "$SPECIAL" == "" ]
	then
		PATCH=$((PATCH+1))
		new_version="$MAJOR.$MINOR.$PATCH-beta1"
	else
		string=$SPECIAL
		prefix="-beta"
		beta_num=${string#"$prefix"}
		beta_num=$((beta_num+1))
		new_version="$MAJOR.$MINOR.$PATCH-beta$beta_num"
	fi
	echo $new_version > sdk-version.txt	
}

if [ -z "$LEANPLUM_ANDROID_SDK_VERSION" ] && [ -z "$LEANPLUM_IOS_SDK_VERSION" ]
then
	echo "skipping tagging"
else
	# bump sdk-version to beta
	git add android/build.gradle
	git add react-native-leanplum.podspec
	incrementBetaNumber
	git commit -m "Bump wrapped SDK Version"
	git tag `cat sdk-version.txt`
	git push https://${GITHUB_TOKEN}@github.com/Leanplum/Leanplum-ReactNative-SDK.git master
	git push https://${GITHUB_TOKEN}@github.com/Leanplum/Leanplum-ReactNative-SDK.git master `cat sdk-version.txt`
fi
