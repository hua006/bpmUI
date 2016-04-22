Arvato.form.CheckBox = function() {

}
Arvato.form.CheckBox.prototype = {
		
}

(function($) {
	$.fn.CheckBox = function() {
		return this.each(function() {
			$(this).hover(function() {
				$(this).addClass("Add");
			}, function() {
				$(this).removeClass("Remove");
			});
		})
	}
})(jQuery);