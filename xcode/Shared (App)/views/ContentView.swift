//
//  ContentView.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//

import SwiftUI

struct ContentView: View {
    var openInWebView: (URL) -> Void

    @State private var showSubscriptions = true

    var body: some View {
        if !showSubscriptions {
            WelcomeWebView(
                openInWebView: openInWebView,
                openSubscriptions: toggleSubscriptions
            )
                .ignoresSafeArea()
        }
        if showSubscriptions {
            Subscriptions(closeSubscriptions: toggleSubscriptions)
        }
    }

    func toggleSubscriptions() {
        self.showSubscriptions.toggle()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(openInWebView: {_ in })
    }
}
