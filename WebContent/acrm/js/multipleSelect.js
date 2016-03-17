function RemoveAllItem(objSel) {
	if (objSel.selectedIndex == -1)
		return;

	for ( var j = 0; j < objSel.length; j++) {
		objSel.options.remove(j);
	}
}

function MoveSelectedItem(sel_source, sel_dest) {
	if (sel_source.selectedIndex == -1)
		return;

	for ( var j = 0; j < sel_source.length; j++) {
		if (sel_source.options[j].selected) {
			var SelectedText = sel_source.options[j].text;
			var SelectedCode = sel_source.options[j].value;
			sel_dest.options.add(new Option(SelectedText, SelectedCode));
			sel_dest.options[sel_dest.length - 1].selected = true;
			sel_source.options.remove(j);
			j--;
		}
	}
}

function MoveAll(sel_source, sel_dest) {
	var sel_source_len = sel_source.length;
	for ( var j = 0; j < sel_source_len; j++) {
		var SelectedText = sel_source.options[j].text;
		var SelectedCode = sel_source.options[j].value;
		sel_dest.options.add(new Option(SelectedText, SelectedCode));
		sel_dest.options[sel_dest.length - 1].selected = true;
	}

	while ((k = sel_source.length - 1) >= 0) {
		sel_source.options.remove(k);
	}
}

function SelectAll(theSel) {
	if (null != theSel) {
		for (var i = 0; i < theSel.length; i++)
			theSel.options[i].selected = true;
	}
}