//
//  Subscriptions.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//

import SwiftUI
import StoreKit

struct Subscriptions: View {
    var openInWebView: (URL) -> Void
    var closeSubscriptions: () -> Void

    @State var isSubscribed = false;
    @EnvironmentObject var storeHelper: StoreHelper

    var body: some View {
        VStack() {
            HStack(spacing: 20) {
                Button(action: closeSubscriptions) {
                    HStack {
                        Image(systemName: "arrow.left")
                        Text("Back")
                    }
                }

                Spacer()
                Button(action: restorePurchases) {
                    HStack {
                        Text("Restore Payments")
                    }
                }
            }
#if os(macOS)
            .padding(.vertical)
#endif
                .frame(maxWidth: .infinity, alignment: .topLeading)


            Text("Support our mission of clean, fast and free internet")
                .multilineTextAlignment(.center)
                .padding()
            Text("Subscribe Today")
                .font(.headline)
                .padding()

            VStack {
                if storeHelper.hasProducts {
                    if let subscriptions = storeHelper.subscriptionProducts {
                        SubscriptionListViewRow(products: subscriptions)
                    }
                } else {
                    Text("No Subscriptions available")
                        .font(.title)
                        .foregroundColor(.red)
                }
            }

            Text("""
            Important:
            1. By subscribing to Ghostery you are supporting our mission. Thank you for beliving in us.

            2. At the moment subscription does not unlock any features, but it helps us.

            3. We work to implement more premium features on Apple platform.

            4. Soon you will be able to link Apple Subscription to Ghostery account to unlock premium features on other platforms.
            """)
                .font(.footnote)
                .lineLimit(nil)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)



            Button("Terms of use") {
                openInWebView(URL(string: "https://www.ghostery.com/")!)
            }
                .buttonStyle(.borderless)
                .foregroundColor(.blue)
                .padding()

        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.horizontal)
        .onAppear { getSubscriptionInfo() }
    }

    /// Restores previous user purchases. With StoreKit2 this is normally not necessary and should only be
    /// done in response to explicit user action. Will result in the user having to authenticate with the
    /// App Store.
    private func restorePurchases() {
        Task.init { try? await AppStore.sync() }
    }

    private func getSubscriptionInfo() {
        Task.init {
            let entitlements = await storeHelper.currentEntitlements()
            self.isSubscribed = !entitlements.isEmpty
        }
    }
}

struct Subscriptions_Previews: PreviewProvider {
    static var previews: some View {
        Subscriptions(openInWebView: {_ in }, closeSubscriptions: {})
    }
}
