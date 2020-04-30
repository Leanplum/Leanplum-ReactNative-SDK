if [ -z "$LEANPLUM_IOS_SDK_VERSION" ]
then 
	version="latest"
else 
	sed -i -e "s/s.dependency 'Leanplum-iOS-SDK', '.*'/s.dependency 'Leanplum-iOS-SDK', '$LEANPLUM_IOS_SDK_VERSION'/g" "react-native-leanplum.podspec"
fi