//
//  WelcomeWebView.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//
import WebKit
import SafariServices
import SwiftUI

#if os(iOS)
import UIKit
#elseif os(macOS)
import Cocoa
#endif

let extensionBundleIdentifier = "com.ghostery.lite.extension"

struct WelcomeWebView {
    var openInWebView: (URL) -> Void
    let navigationHelper = WebViewHelper()
    let webView: WKWebView = WKWebView()

    public func load() {
        let userContentHelper = WebViewUserContentHelper(openInWebView: openInWebView)

        webView.navigationDelegate = navigationHelper

        webView.configuration.userContentController.add(userContentHelper, name: "controller")


        #if os(iOS)
            webView.scrollView.isScrollEnabled = false
        #endif


        webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }
}


class WebViewUserContentHelper: NSObject, WKScriptMessageHandler {
    var openInWebView: (URL) -> Void

    init(openInWebView: @escaping (URL) -> Void) {
        self.openInWebView = openInWebView
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if (message.body as! String == "open-support") {
            openInWebView(URL(string: "https://www.ghostery.com/support")!)
        }

        #if os(macOS)
            if (message.body as! String == "open-preferences") {
                SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                    guard error == nil else {
                        // Insert code to inform the user that something went wrong.
                        return
                    }

                    DispatchQueue.main.async {
                        NSApplication.shared.terminate(nil)
                    }
                }
            }
        #endif
    }
}

class WebViewHelper: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        #if os(iOS)
            webView.evaluateJavaScript("show('ios')")
        #elseif os(macOS)
            webView.evaluateJavaScript("show('mac')")

            SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
                guard let state = state, error == nil else {
                    // Insert code to inform the user that something went wrong.
                    return
                }

                DispatchQueue.main.async {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled))")
                }
            }
        #endif
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
    }

    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
    }
}
