// Class to holds a Bottle attributes
function PlaceViewModel(name, website, rating, reference, longitute, latitude, international_phone_number, vicinity, formatted_phone_number, url, formatted_address, id, types, icon, category, street_number, route, locality, province, country, postal_code) {
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
    self.StreetNumber = ko.observable(street_number);
    self.Route = ko.observable(route);
    self.Locality = ko.observable(locality);
    self.Province = ko.observable(province);
    self.Country = ko.observable(country);
    self.PostalCode = ko.observable(postal_code);
    self.IsVisible = ko.observable(true);

    self.ToggleVisibility = ko.computed(function() {
        if (self.Marker)
        {
            self.Marker.setVisible(self.IsVisible());
        }

        return self.IsVisible() ? "" : "display-none";
    });

    self.Distance = ko.computed(function() {
        return PL.Utilities.Haversine(PL.GoogleMaps.Latitude(), PL.GoogleMaps.Longitude(), self.Latitude(), self.Longitude());
    }, this);

    self.Bearing = ko.computed(function() {
        var bearing = PL.Utilities.Bearing(PL.GoogleMaps.Latitude(), PL.GoogleMaps.Longitude(), self.Latitude(), self.Longitude());
        // Ajust for the 45 deg compass icon and return css rotate
        return "rotate(" + (Math.round(bearing) - 45) + "deg)";
    });

    self.BearingStyle = ko.computed(function() {
        var transform = [];
        transform.push("transform:" + self.Bearing() + ";");
        transform.push("-webkit-transform:" + self.Bearing() + ";");
        transform.push("-moz-transform:" + self.Bearing() + ";");
        transform.push("-ms-transform:" + self.Bearing() + ";");
        transform.push("-o-transform:" + self.Bearing() + ";");
        return transform.join("");
    });

    self.CategoryCss = ko.computed(function() {
        if (self.Category() == PL.HoublonVa.CATEGORY_MICRO) return "cat-micro";
        else if (self.Category() == PL.HoublonVa.CATEGORY_PUB) return "cat-pub";
        else if (self.Category() == PL.HoublonVa.CATEGORY_MARKET) return "cat-market";
    });

    self.AddressStreet = ko.computed(function() {
        return self.StreetNumber() + " " + self.Route();
    });

    self.AddressCity = ko.computed(function() {
        var addressCity = self.Locality() + ", " + self.Province() + " " + self.PostalCode();
        if (addressCity && addressCity.indexOf(",") === 0) {
            addressCity = addressCity.replace("," , "");
        }
        return addressCity;
    });

    self.WebsiteClean = ko.computed(function(){
        var clean = self.Website().replace("http://", "").replace("www.", "");
        if (clean.indexOf("/") >= 0) clean = clean.substr(0, clean.indexOf("/"));
        return clean;
    });

    if (category === 1) self.Marker = PL.GoogleMaps.AddYellowMarker(longitute, latitude, name);
    else if (category === 2) self.Marker = PL.GoogleMaps.AddRedMarker(longitute, latitude, name);
    else if (category === 3) self.Marker = PL.GoogleMaps.AddGreenMarker(longitute, latitude, name);


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