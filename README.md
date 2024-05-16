<!--
 //////////////////////////////////////////////////////////////////////////////
 // @license
 // This file is part of yFiles for HTML 2.6.0.4.
 // Use is subject to license terms.
 //
 // Copyright (c) 2000-2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 // 72070 Tuebingen, Germany. All rights reserved.
 //
 //////////////////////////////////////////////////////////////////////////////
-->
<div class="header">

# Getting started

<div style="padding: 0 2em">
  <img src="./doc/readme/resources/yworks-logo-dark.svg" class="logo" alt=""/>
</div>
<div style="font-size:20px;">yFiles for HTML 2.6.0.4</div>
</div>

<div class="box">
<img src="./doc/readme/resources/icon-rocket.svg" class="logo" alt="">

## First-time setup

- [Check the technical requirements](https://docs.yworks.com/yfileshtml/#/dguide/introduction-technical_requirements).
- [Set up the contents of this package](https://docs.yworks.com/yfileshtml/#/dguide/getting_started%23first-time-setup) in your project.
- [Start learning to develop](https://docs.yworks.com/yfileshtml/#/dguide/getting_started-ide) with yFiles for HTML.
- [Build your first own app](https://docs.yworks.com/yfileshtml/#/dguide/getting_started-application) with yFiles for HTML.
- [Read the Software License Agreement](https://www.yworks.com/products/yfiles-for-html/sla)

</div>
<div class="box">
<img src="./doc/readme/resources/learnyfiles-school.svg" class="logo" alt="">

## Intro to yFiles

Learn yFiles Basics and find good entry points to start working on your own project.
Please open the package's project in an IDE (i.e. WebStorm or VSCode), as described in [First-time setup](https://docs.yworks.com/yfileshtml/#/dguide/getting_started%23first-time-setup).

- [Read the tutorial](https://docs.yworks.com/yfileshtml/#/dguide/getting_started-application)
- [Watch introductory videos](https://www.youtube.com/playlist?list=PLpIlEtPgrZsU4icTnBORqSV23tLVvPObd) (extenal link)
- Work through the interactive tutorial. The first tutorial step can be found relative to your package root in
  - <img src="https://www.yworks.com/external/typescript.svg" alt="TS" style="width: 16px; height: 16px"/> demos-ts/tutorial-yfiles-basic-features
  - <img src="https://www.yworks.com/external/javascript.svg" alt="JS" style="width: 16px; height: 16px"/> demos-js/tutorial-yfiles-basic-features

</div>
<div class="box">
<img src="./doc/readme/resources/demos.svg" class="logo" alt="">

## Your own yFiles app

Create your own yFiles project from scratch, or learn how to integrate yFiles into
your existing project.

- [Manual Setup](https://docs.yworks.com/yfileshtml/#/dguide/getting_started-application)
- Integrate yFiles into an existing project
  - [Working with the yFiles npm module](https://docs.yworks.com/yfileshtml/#/dguide/yfiles_npm_module)
  - [Register the license](https://docs.yworks.com/yfileshtml/#/dguide/license_registering)

</div>

## Demos

<div class="box">
<img src="./doc/readme/resources/demos.svg" class="logo" alt="">

## Source code demo applications

- [Browse the bundled demo applications.](http://localhost:4242/demos-ts/README.html)
- View the demo source code. The demo applications are available in TypeScript and JavaScript and can be found relative to your package root in
  - <img src="https://www.yworks.com/external/typescript.svg" alt="TS" style="width: 16px; height: 16px"/> demos-ts
  - <img src="https://www.yworks.com/external/javascript.svg" alt="JS" style="width: 16px; height: 16px"/> demos-js

</div>

## Documentation & help

yFiles for HTML ships with comprehensive documentation and video tutorials:

<div class="box">
<img src="./doc/readme/resources/documentation.svg" class="logo" alt="">

## Documentation

- [API Documentation and Developer's Guide](https://docs.yworks.com/yfileshtml/)
- [Getting Started Developer's Guide Chapter](https://docs.yworks.com/yfileshtml/#/dguide/getting_started)

</div>
<div class="box">
<img src="./doc/readme/resources/videos.svg" class="logo" alt="">

## yFiles videos

- [Video Tutorials on YouTube](https://youtube.com/yWorksTube) (external link)
- Videos to get you started
  - [First time setup](https://player.vimeo.com/video/566931119) (external link)
  - [Using the Dev Suite](https://player.vimeo.com/video/566932189) (external link)
  - [Integrate yFiles for HTML](https://player.vimeo.com/video/566930077) (external link)

</div>
<div class="box">
<img src="./doc/readme/resources/support.svg" class="logo" alt="">

## yWorks support

If you have read the documentation and are still stuck, feel free to [contact our support team](https://www.yworks.com/products/yfiles/support).
Please follow [these guidelines](https://docs.yworks.com/yfileshtml/#/kb/article/715/Writing_Good_Support_Requests)
to get the answers as fast and precise as possible.

</div>

## Returning developers

<img src="./doc/readme/resources/release-notes.svg" class="list-icon" alt="">

[Release notes (changes)](https://www.yworks.com/products/yfiles-for-html/changelog)

<img src="./doc/readme/resources/migration-guide.svg" class="list-icon" alt="">

[Migration Guide](https://docs.yworks.com/yfileshtml/#/dguide/migration)

## License

<img src="./doc/readme/resources/pricing-2.svg" class="list-icon" alt="">

[Pricing & order](https://www.yworks.com/products/pricing)

## License and redistribution information

The files in the directory `lib` are the Redistributables as mentioned in Section 2 in the
[license terms](http://localhost:4242/doc/readme/legal/SOFTWARE_LICENSE_AGREEMENT.html).


### Third party code and licenses

Neither the Redistributable(s) of yFiles for HTML nor the included demos contain any third-party libraries or code.

## Contact

[Help and support](https://www.yworks.com/products/yfiles/support).

yWorks GmbH, Vor dem Kreuzberg 28, 72070 Tuebingen, Germany

Phone: +49 7071 979050

Email: contact@yworks.com

<style>
body {
  max-width: 80em;
}
.header {
  background-color: black; color: white;
  display: flex; justify-content: center; align-items: center;
  padding: 10px 20px;
}
.header .logo {
  width: 64px; height: 64px; background-color:black;
}
.box {
  box-shadow: 0 2px 5px #00000059; border-radius: 8px;
  padding: 10px 20px; margin-top: 2ex;
}
.box h2 {
  margin-top: 0
}
.box .logo {
  width: 32px; height: 32px; float: right;
}
.list-icon {
  width: 16px; height: 24px; float: left; margin-right: 1ex;
}
</style>
