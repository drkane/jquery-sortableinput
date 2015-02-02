/*
 * jquery sortable input plugin v0.2.0
 * https://github.com/drkane/jquery-sortableinput
 *
 * Copyright (c) 2014 David Kane. All rights reserved. 
 * Released under the GPL
 * 
 * Date: 2014-09-07
 */
 (function ( $ ) {

	$.fn.sortableInputList = function( options ) {
	
		// config variables
		var config = $.extend({
            // These are the defaults.
            add_selector: ".add",
			delete_selector: ".delete",
			item_selector: "li",
			make_sortable: true,
			sort_options: {}
        }, options );
		
		var sort_options = $.extend({
			items: config.item_selector,
			update: function( ev, ui ){
				refresh_sortable();
			}
		}, config.sort_options );
		
		var home_element = this;
		
		// to add a new row
		this.on( "click", config.add_selector, function(ev){
			ev.preventDefault();
			var item = $(home_element).find(config.item_selector).last().clone();
			$(item).find('option:selected').removeAttr("selected");
			$(item).find('input').val("");
			$(item).find('textarea').val("");
			$(home_element).find(config.item_selector).last().after(item);
			refresh_sortable();
		});
		
		// to delete a row
		this.on( "click", config.delete_selector, function(ev){
			ev.preventDefault();
			if($(home_element).find(config.item_selector).length>1){
				$(this).closest(config.item_selector).remove();
			} else {
				$(this).closest(config.item_selector).find('option:selected').removeAttr("selected");
				$(this).closest(config.item_selector).find('input').val("");
				$(this).closest(config.item_selector).find('textarea').val("");
			}
			refresh_sortable();
		});
		
		// make the list sortable
		if(config.make_sortable && $.isFunction(jQuery.fn.sortable)){
			$( home_element ).sortable( sort_options );
		}
		
		// refresh the sortable when any of the items are changed
		this.on( "change", config.item_selector + " input , " + config.item_selector + " textarea , " + config.item_selector + " select", function(){
			refresh_sortable();
		});
		
		// refresh the list
		// - replaces the "name" attribute with a template, if the template is present
		// - the template is stored in the data-name-template of any inputs, textareas or selects
		// - the value of any input, textarea or select can be used in name-templates by specifying a data-key on the option and then surrounding with %data-key% in the template
		var refresh_sortable = function() {
		
			$(home_element).find(config.item_selector).each( function( item_index ){
				var replacements = { 'index': item_index };
				$(this).find('input, textarea, select').each( function( index ) {
					if( $(this).data('key') ){
						replacements[$(this).data('key')] = $(this).val();
					}
				});
				$(this).find('input, textarea, select').each( function( index ) {
					if( $(this).data('name-template') ){
						var new_name = $(this).data('name-template');
						$.each(replacements, function( k, v){
							new_name = new_name.replace( '%' + k + '%', v );
						});
						$(this).attr("name", new_name );
					}
				});
			});
		
		}
		
		refresh_sortable();
		
		return this;
		
	};

}( jQuery ));
