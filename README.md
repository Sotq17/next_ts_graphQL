
Next_TS_GraphQL
===============

## 開発環境

- node v14.15.0
- npm v6.14.8

### install

```
$ npm ci
```

### usage

```
$ npm run dev
```

### test

```
$npm run test
```

### eslint

#### check

```
$npm run lint
```

#### fix

```
$npm run lint:fix
```

## フォルダ構成

```
└── src
    ├── components (pages内で使用するコンポーネント)
    │   ├── atom (最小単位のコンポーネント)
    │   ├── block (atomより大きい単位のコンポーネント)
    │   ├── layout (全体で使用するレイアウトのコンポーネント)
    │   └── module (特別な機能を持ったコンポーネント)
    │       └── modal (モーダルのカスタムフック)
    ├── graphQL (graphQLの定義)
    ├── pages
    │   └── [id]
    ├── style (切り分けたCSS in JS)
    ├── test (テストファイル置き場)
    └── types (切り分けた型ファイル)
```
