// Class to holds a Bottle attributes
function PlaceViewModel(name, website, rating, reference, longitute, latitude, international_phone_number, vicinity, formatted_phone_number, url, formatted_address, id, types, icon, category) {
	var self = this;
	
	self.Name = ko.observable(name);
	self.Website = ko.observable(website);
	self.Rating = ko.observable(rating);
	self.Reference = ko.observable(reference);
	self.Longitude = ko.observable(longitute);
	self.Latitude = ko.observable(latitude);
	self.InternationalPhoneNumber = ko.observable(international_phone_number);
	self.Vicinity = ko.observable(vicinity);
	self.FormattedPhoneNumber = ko.observable(formatted_phone_number);
	self.Url = ko.observable(url);
	self.FormattedAddress = ko.observable(formatted_address);
	self.Id = ko.observable(id);
	self.Types = ko.observable(types);
	self.Icon = ko.observable(icon);
	self.Category = ko.observable(category);

	self.Distance = ko.computed(function() {
        return PL.Utilities.Haversine(self.Longitude(), self.Latitude(), PL.GoogleMaps.Longitude(), PL.GoogleMaps.Latitude());
    }, this);

	self.CategoryCss = ko.computed(function() {
		if (self.Category() == 1) return "cat-micro";
		else if (self.Category() == 2) return "cat-pub";
		else if (self.Category() == 3) return "cat-market";
	});

    self.Marker = PL.GoogleMaps.AddMarker(longitute, latitude, name);

    self.InfoWindow = new google.maps.InfoWindow({
      content: "<div>" + self.Name() + "</div>"
  	});

	google.maps.event.addListener(self.Marker, 'click', function() {
		PL.GoogleMaps.OpenInfoWindow(self.InfoWindow, self.Marker);
  	});

  	self.OpenInfoWindowAndCenter = function() {
  		google.maps.event.trigger(self.Marker, 'click');
  		PL.GoogleMaps.Center(new google.maps.LatLng(self.Latitude(), self.Longitude()));
  	};

}