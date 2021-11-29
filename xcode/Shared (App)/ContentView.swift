//
//  ContentView.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//

import SwiftUI

struct ContentView: View {
    var openInWebView: (URL) -> Void

    var body: some View {
        WelcomeWebView(openInWebView: openInWebView)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(openInWebView: {_ in })
    }
}
