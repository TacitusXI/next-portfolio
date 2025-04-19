// Test file to diagnose regex issue
(function() {
  // Original problematic regex
  function testOriginal() {
    try {
      // This is line 30
      var regex = /url\(["']?\/_next\//g;
      console.log("Original regex works!");
    } catch (e) {
      console.error("Original regex error:", e.message);
    }
  }
  
  // Modified regex with no flags
  function testNoFlags() {
    try {
      var regex = /url\(["']?\/_next\//;
      console.log("No flags regex works!");
    } catch (e) {
      console.error("No flags regex error:", e.message);
    }
  }
  
  // Modified regex with escaped characters
  function testEscaped() {
    try {
      var regex = /url\(["']?\/\_next\//g;
      console.log("Escaped regex works!");
    } catch (e) {
      console.error("Escaped regex error:", e.message);
    }
  }
  
  // Double escaped for string template
  function testDoubleEscaped() {
    try {
      // This is how it might appear in a template string
      var regex = new RegExp("url\\\\\\([\"']?\\\\/\\\\_next\\\\/", "g");
      console.log("Double escaped regex works!");
    } catch (e) {
      console.error("Double escaped regex error:", e.message);
    }
  }
  
  // Run all tests
  testOriginal();
  testNoFlags();
  testEscaped();
  testDoubleEscaped();
  
  console.log("Test complete!");
})(); 