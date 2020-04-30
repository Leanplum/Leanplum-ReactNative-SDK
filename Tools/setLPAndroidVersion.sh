#!/bin/bash
if [ -z "$LEANPLUM_ANDROID_SDK_VERSION" ]
then 
	version="latest"
else 
	sed -i -e "s/implementation 'com.leanplum:leanplum-core:.*'/implementation 'com.leanplum:leanplum-core:$LEANPLUM_ANDROID_SDK_VERSION'/g" "android/build.gradle"
	rm android/build.gradle-e
fi
