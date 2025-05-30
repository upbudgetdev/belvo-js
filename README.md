# 🌟 @upbudget/belvo-js

# Belvo Widget SDK

A lightweight wrapper for seamlessly integrating Belvo's Hosted Widget (OFDA) into your applications. This SDK simplifies the implementation process for React, Next.js, and Expo projects, providing a straightforward way to connect with Belvo's financial data aggregation services.

## 📦 Installation

First things first, let's get you set up. You can install the SDK using your favorite package manager. Here's how you can do it with `pnpm`:

```bash
pnpm add @upbudget/belvo-js
```

## 🔧 Usage

### How to use with Next.js:

Here's how you can set up the `BelvoNextProvider` in a Next.js application:

```jsx
import BelvoConnectButton, { BelvoNextProvider } from '@upbudget/belvo-js/nextjs';

export default function Home() {
  return (
    <BelvoNextProvider getAccessToken={async () => {
      const res = await fetch('/api/belvo/access-token');
      return await res.json();
    }}>
      <>
        <div id="belvo" />
        <BelvoConnectButton asChild config={{
          external_id: user?.id,
          onSuccess: (link: string, institution: string) => {
            console.log(link, institution);
          }
        }}>
          <Button variant="outline">
            <RiBankCardLine className="w-6 h-6"/>
            Conectar
          </Button>
        </BelvoConnectButton>
      </>
    </BelvoNextProvider>
  );
}
```

Please check out Belvo's documentation on how to [Generate an access token](https://developers.belvo.com/products/aggregation_brazil/ofda-widget-introduction#generate-an-access-token)

## 📚 Documentation

For more detailed information, check out the [Belvo Hosted Widget](https://developers.belvo.com/products/aggregation_brazil/ofda-widget-introduction). It's packed with everything you need to know to make the most out of the Belvo SDK.

## 🤝 Contributing

We love contributions! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---
