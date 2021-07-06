require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-leanplum"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-leanplum
                   DESC
  s.homepage = 'https://www.leanplum.com'
  s.license = { :type => 'Commercial', :text => 'See https://www.leanplum.com/tos' }  
  s.authors      = { "Leanplum" => "e2@leanplum.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/Leanplum/Leanplum-ReactNative-SDK", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency 'React-Core'
  s.dependency 'Leanplum-iOS-SDK', '3.2.1'
end
