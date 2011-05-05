# About

jquery.flickr.js is a jquery-plugin to show flickr latest photos.


# License

Copyright (c) 2011 ryo katsuma
Licensed under the MIT:  
http://www.opensource.org/licenses/mit-license.php


# Require

jQuery 1.5 and above


# Usage

load photos (user_name is always required.)  
    `$('#foo').flickr({ user_name: 'katsuma'});`

set view number  
    `$('#foo').flickr({ user_name: 'katsuma', view_num: 3 });`

set photo size(square, thumbnail, small, medium, medium640 or original)  
    `$('#foo').flickr({ user_name: 'katsuma', view_num: 3, size: 'small'});`


# Demo

http://katsuma.github.com/jquery-flickr-plugin/