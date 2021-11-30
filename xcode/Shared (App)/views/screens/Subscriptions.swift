//
//  Subscriptions.swift
//  Ghostery
//
//  Created by Krzysztof Jan Modras on 29.11.21.
//

import SwiftUI

struct Subscriptions: View {
    var closeSubscriptions: () -> Void

    @StateObject var storeHelper = StoreHelper()

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
                Button(action: {}) {
                    HStack {
                        Text("Restore Payments")
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .topLeading)
            VStack(spacing: 10) {
                Text("Subscriptions")
                
                Text("Support Ghostery's mission to Track the Trackers")
                Text("Subscribe Today for just $3.99/month")

                if storeHelper.hasProducts {
                    List(storeHelper.products!) { product in
                        HStack {
                            Text(product.displayName)
                                .font(.title2)
                                .padding()

                            Spacer()

                            Text(product.displayPrice)
                                .font(.title2)
                                .foregroundColor(.blue)
                                .padding()

                            Button(action: {
                                Task.init { try await storeHelper.purchase(product) }

                            }) {
                                Text("Purchase")
                            }
                        }
                        .padding()
                    }
                    .listStyle(.inset)

                } else {
                    Text("No products")
                        .font(.title)
                        .foregroundColor(.red)
                }
            }

        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(10)
    }
}

struct Subscriptions_Previews: PreviewProvider {
    static var previews: some View {
        Subscriptions(closeSubscriptions: {})
    }
}
