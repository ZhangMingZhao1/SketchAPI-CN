# developer.sketchapp.com

This repository powers the development site for [Sketch](http://sketchapp.com), that lives at [developer.sketchapp.com](http://developer.sketchapp.com).

[中文版](https://github.com/BoltDoggy/SketchAPI-CN/blob/gh-pages/README_CN.md)

## Contribute!

We've made this repository public so you can contribute to it. If you find a typo, or an error, or want to improve the content, feel free to send us a pull request. Also, if there's anything you'd like to see covered or documented, file an issue and we'll do it for you.

We use [Jekyll](http://jekyllrb.com) as our content backend, so make sure to read their docs if you need help understanding how the system works.

## Setup

If you want to get the site working locally, you'll need to have [node](https://nodejs.org/en/) and [bundler](http://bundler.io) installed. On OS X you'll also need to have Xcode's command line tools installed (`xcode-select --install`).

Once you have them, run this:

```
./run
```

in the project root to start the server. The `run` script will take care of installing all the needed dependencies if they’re not installed, so it may take a while if it’s the first time you’re running it.

Note: you may find issues with nokogiri when running `run`. If that's the case, try the following:

```
  bundle config build.nokogiri --use-system-libraries --with-xml2-include=/usr/include/libxml2/
```

If that doesn't work, check the troubleshooting tips on [Nokogiri's page](http://www.nokogiri.org/tutorials/installing_nokogiri.html#mac_os_x)

## Generated Sections

As well as the normal Jekyll processing, there are some areas of the site where the source files are themselves generated by other tools. In particular:

* The API documentation is stored in the [SketchAPI](https://github.com/BohemianCoding/SketchAPI) repo to keep it close to the code.

Both of these scripts have some dependencies, and neither are really set up to be run by other people (nor should it be necessary to do so). It's worth knowing that they are there however! Don't waste time hand-editing this generated content, as it will just get replaced next time the scripts are run. Instead, file pull-requests to change the things that the scripts generate the content _from_ - eg the SketchAPI repo or the repos for the example plugins (all of which are open-source).
