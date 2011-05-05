/**
 * jQuery Flickr plugin
 * https://github.com/katsuma/jquery-flickr-plugin
 * required jQuery 1.5 and above
 *
 * Copyright (c) 2011 ryo katsuma
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($){
  $.fn.flickr = function(options){
	var self = this;
	var defaults = {
	  top_url : 'http://flickr.com/',
	  api_url : 'http://api.flickr.com/services/rest/?',
	  api_key : '4faeeab50cc5eb89cd73cdc2350e52e4',
	  user_name : '',
	  user_id : '',
	  view_num : 6,
	  size : 'square',
	  photos : {}
	};
	var setting = $.extend(defaults, options);

	var methods = {
	  requestOptions : {
		api_key : setting.api_key,
		format : 'json'
	  },

	  findByUsername : function(user_name){
		if(!user_name) {
		  throw new Error('Username param Exception');
		  return self;
		}
		var method = 'flickr.people.findByUsername';
		return $.ajax({
		  url: setting.api_url,
		  data : $.extend(this.requestOptions, { method : method, username : user_name }),
		  dataType: 'jsonp',
		  jsonp : 'jsoncallback',
		  success : function(data, status){
			if(!data.stat || data.stat!='ok') {
			  throw new Error('findByUsername Exception');
			  return;
			}
			setting.user_id = data.user.nsid;
		  }
		});
	  },

	  getPublicPhotos : function(user_id){
		var method = 'flickr.people.getPublicPhotos';
		var user_id = user_id || setting.user_id;
		return $.ajax({
		  url: setting.api_url,
		  data : $.extend(this.requestOptions, { method : method, user_id : user_id }),
		  dataType: 'jsonp',
		  jsonp : 'jsoncallback',
		  success: function(data, status){
			if(!data.stat || data.stat!='ok') {
			  throw new Error('getPublicPhotos Exception');
			  return;
			}
			setting.photos = data.photos.photo;
		  }
		});
	  },

	  loadPhoto : function(photo){
		if(photo == null) {
		  throw new Error('Load photo Exception');
		  return;		  
		}
		var title = photo.title;
		var photoId = photo.id;
		var view_num = setting.view_num;
		var method = 'flickr.photos.getSizes';
		return $.ajax({
		  url: setting.api_url,
		  data : $.extend(this.requestOptions, { method : method, photo_id : photoId }),
		  dataType: 'jsonp',
		  jsonp : 'jsoncallback',
		  success : function(data, status){
			if(!data.stat || data.stat!='ok') {
			  throw new Error('getSize Exception');
			  return;
			}
			
			var sizeIndices = { square : 0, thumbnail : 1, small : 2, medium : 3, medium640 : 4, original : 5 };
			var sizeIndex = sizeIndices[setting.size] || 0;
			var sqData = data.sizes.size[sizeIndex];
			if(sqData == null) return self;

			var jpgSource = sqData.source;
			var jpgUrl = sqData.url;
			var jpgId = jpgUrl.match(/(\d+)\/sizes/)[1];
			var user_name = setting.user_name;
			var photo_page_url = setting.top_url + 'photos/' + user_name + '/' + jpgId + '/';
			var photo_html = '<a href="' + photo_page_url + '"><img src="' + jpgSource + '" border="0" id="flickrimg_' + photoId + '" class="flickrimg" alt="' + title + '" /></a>';
			
			$(self).html($(self).html() + photo_html);
		  }
		});
	  },
	};

	$.when(methods.findByUsername(setting.user_name)).then(function(){
	  $.when(methods.getPublicPhotos()).then(function(){
		$.when.apply($, (function(){
		  var photos = setting.photos;
		  var functions = [];
		  for(var i=0, len=setting.view_num; i<len; i++) { functions.push(methods.loadPhoto(photos[i])); }
		  return functions;
		})()).then(function(){
		  return self;
		});
	  });
	});
  };
})(jQuery);


