$( document ).ready( function(){
	activateTab3();
	toolBar();
});
function activateTab3(){
	HTMLTextAreaElement.prototype.setCaretPosition = function (start, end) {    //change the caret position of the textarea
		end = typeof end !== 'undefined' ? end : start;
		
		this.selectionStart = start;
		this.selectionEnd = end;
		this.focus();
	};

	HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
		if (this.selectionStart == this.selectionEnd) {
			return false;
		} else {
			return true;
		}
	};

	HTMLTextAreaElement.prototype.isMultilineSelection = function() {
		var re = new RegExp('(\n)', "g");
		return (this.value.substring(this.selectionStart, this.selectionEnd).match(re)||[]).length > 0 ? true : false;
	};

	$('textarea').on('keydown', function(e) {
		// Only continue if we are pushing tab or shift
		if (e.keyCode != 9 || e.ctrlKey || e.altKey) return;
		
		var target = e.target;
		
		var selectionStart = target.selectionStart;
		var selectionEnd = target.selectionEnd;
		
		var lineStart = selectionStart;
		for(lineStart = selectionStart; lineStart >= 0 && target.value[lineStart] != "\n"; lineStart--);
		
		var lineEnd = selectionEnd;
		for (lineEnd = selectionEnd; lineEnd < target.value.length && target.value[lineEnd] != "\n"; lineEnd++);
		
		
		var text = target.value.substring(lineStart, lineEnd);
		
		//console.log(showStringSpecialCharacters(text));
		
		var tabString = "    ";
		
		// Are we selecting multiple lines?
		if(this.hasSelection() && this.isMultilineSelection())
		{
			var numChanges = 0;
			var firstLineNumChanges = 1;
			
			if (!e.shiftKey) { // Normal Tab
				var re = new RegExp('(\n)', "g");
				
				numChanges = (text.match(re)||[]).length;
				
				text = text.replace(re, '$1' + tabString); 
			} else { // Shift+Tab
				var re = new RegExp('(\n)' + tabString, "g");
				
				numChanges = (text.match(re)||[]).length;
				
				var indexOfNewLine = 1;
				for (indexOfNewLine = 1; indexOfNewLine < text.length && text[indexOfNewLine] != "\n"; ++indexOfNewLine);
				firstLineNumChanges = (text.substring(0, indexOfNewLine).match(re)||[]).length;
				
				text = text.replace(re, '$1');
			}
			
			
			target.value = target.value.substring(0, lineStart) + text + target.value.substring(lineEnd, target.value.length);
			
			// Keep the selection we had before
			var newSelectionStart = (selectionStart + (tabString.length * ((!e.shiftKey) ? 1 : -1)) * firstLineNumChanges);
			var newSelectionEnd = selectionEnd + ((tabString.length*numChanges * ((!e.shiftKey) ? 1 : -1)));
			
			
			this.setCaretPosition(newSelectionStart, newSelectionEnd);
		}
		else 
		{
			// We are not in multiline so
			// we should add a tab at the position
			// only shift-tab if there is a tab present before
			
			if (!e.shiftKey) { // Normal Tab
				
				target.value = target.value.substring(0, selectionStart) + tabString + target.value.substring(selectionEnd, target.value.length);
				
				target.setCaretPosition(selectionStart + tabString.length, selectionEnd + tabString.length);
				
			}
			else if(target.value.substring(selectionStart - tabString.length, selectionStart) == tabString) { // Shift+Tab
				target.value = target.value.substring(0, selectionStart - tabString.length) +  target.value.substring(selectionEnd,  target.value.length);
				
				target.setCaretPosition(selectionStart - tabString.length, selectionEnd - tabString.length);
				
			}
		}
		return false;
	});

	function showStringSpecialCharacters(string) 
	{
		string = string.replace(/[\n]/g,'\\n');
		string = string.replace(/[\r]/g,'\\r');
		string = string.replace(/[\t]/g,'\\t');
		string = string.replace(/[\b]/g,'\\b');
		string = string.replace(/[\f]/g,'\\f');
		
		return string;
	}
}

function toolBar(){
	$('.html-wrapper section.main-section .tool-bar > ul > li > a').click(function(e){
		e.preventDefault();
		var tag = $(this).attr('elementData');
		//if ( start!=end )
		//{
			//wrap the selection with chosen tag
			//console.log( 'wrap the selection with chosen tag' );
		//}else{
			//place the tag in normal flow
			//console.log( 'place the tag in normal flow' );
		//}
		var position = $('#html-editor').getCursorPosition();
		var content = $('#html-editor').val();
		var newContent = content.substr(0, position) + tag + content.substr(position);
		$('#html-editor').val( newContent );
		//console.log(start,',',end);
	});


	/*$('#btn-submit').click( function(){
		 //location.reload(); 
	});*/
	
}


(function ($, undefined) {
	$.fn.getCursorPosition = function () {
		var el = $(this).get(0);
		var pos = 0;
		if ('selectionStart' in el) {
			pos = el.selectionStart;
		} else if ('selection' in document) {
			el.focus();
			var Sel = document.selection.createRange();
			var SelLength = document.selection.createRange().text.length;
			Sel.moveStart('character', -el.value.length);
			pos = Sel.text.length - SelLength;
		}
		return pos;
	}
})(jQuery);

function activateTab2(){
	$(document).delegate('#html-editor', 'keydown', function(e) {
	  var keyCode = e.keyCode || e.which;

	  if (keyCode == 9) {
		e.preventDefault();
		var start = $(this).get(0).selectionStart;
		var end = $(this).get(0).selectionEnd;

		// set textarea value to: text before caret + tab + text after caret
		$(this).val($(this).val().substring(0, start)
					+ "\t"
					+ $(this).val().substring(end));

		// put caret at right position again
		$(this).get(0).selectionStart =
		$(this).get(0).selectionEnd = start + 1;
	  }
	});
}
		