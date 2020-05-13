var clubId = 6654;
var clubName = "Scouting Klimopgroep Waddinxveen";
var clubLink = "https://www.sponsorkliks.com/winkels.php?club=6654";
var excludes = ["sponsorkliks.com", "ideal", "utm_medium", "microsoft.com"];
var sponsorkliksLink = "http://www.sponsorkliks.com/link.php?club={club_id}&shop_id={shop_id}&shop={shop_name}";

function extractDomain(url)
{
  // Find and remove protocol (http, ftp, etc.) and get domain
  var domain = url.indexOf("://") > -1 ? url.split('/')[2] : url.split('/')[0];

  // Find and remove port number
  domain = domain.split(':')[0];

  return domain;
}

function redirectShop(url, ref)
{
  var refdomain = extractDomain(ref);

  // Do nothing if redirected from e.g. sponsorkliks or iDeal payment
  if(excludes.some(function(excl) { return ref.indexOf(excl) != -1 || url.indexOf(excl) != -1; } ))
    return;

  // Do nothing if this is not the first page view of a website
  if (refdomain && url.indexOf(refdomain) != -1)
    return;

  // Find matching webshop
  var match = shops.filter(function(s) { return url.indexOf("." + s.domain.toLowerCase()) != -1 || url.indexOf("://" + s.domain.toLowerCase()) != -1; });

  // Do nothing if no matching shop was found
  if (match.length == 0)
    return;

  // Get shop with the most specific matched domain
  match = match.sort(function(a, b) { return (a.domain.length - b.domain.length); });
  var shop = match.pop();

  // Redirect if confirmed by user
  if (confirm("Wilt u met uw aankoop bij deze webshop een gratis bijdrage leveren aan " + clubName + "?"))
    location.href = sponsorkliksLink.replace("{club_id}", clubId).replace("{shop_id}", shop.id).replace("{shop_name}", shop.name);
}

var url = document.URL.toLowerCase();
var ref = document.referrer.toLowerCase();
redirectShop(url, ref);
