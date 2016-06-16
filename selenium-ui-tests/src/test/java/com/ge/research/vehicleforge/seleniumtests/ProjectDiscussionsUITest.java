package com.ge.research.vehicleforge.seleniumtests;

import java.util.concurrent.TimeUnit;
import junit.framework.TestCase;
import org.junit.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

public class ProjectDiscussionsUITest extends TestCase {
	private WebDriver driver;
	  private String baseUrl;
	  
	  @Before
	  public void setUp() throws Exception {
	    // Download chromedriver (http://code.google.com/p/chromedriver/downloads/list)
	    System.setProperty("webdriver.chrome.driver", "<YOUR_CHROME_DIRVER_FILE_PATH>");
	    driver = new ChromeDriver();
	    baseUrl = "http://localhost/my-projects.php#/";
	    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	  }
	  
	  @Test
	  public void test() throws Exception {
	    driver.findElement(By.linkText("View All (4)")).click();
	    driver.findElement(By.id("input_4")).sendKeys("new");
	    driver.findElement(By.cssSelector("button.search-button.md-button.md-default-theme")).click();
	    driver.findElement(By.linkText("New Discussion")).click();
	    driver.findElement(By.cssSelector("div.layout.layout-row.layout-align-center-center > button.md-button.md-default-theme")).click();
	    driver.findElement(By.cssSelector("html..js.flexbox.flexboxlegacy.canvas.canvastext.webgl.no-touch.geolocation.postmessage.websqldatabase.indexeddb.hashchange.history.draganddrop.websockets.rgba.hsla.multiplebgs.backgroundsize.borderimage.borderradius.boxshadow.textshadow.opacity.cssanimations.csscolumns.cssgradients.cssreflections.csstransforms.csstransforms3d.csstransitions.fontface.generatedcontent.video.audio.localstorage.sessionstorage.webworkers.applicationcache.svg.inlinesvg.smil.svgclippaths > body.ng-scope > div.ng-scope > div.individual-discussion.ng-scope > div.layout.layout-column > div.layout.layout-row > div.margin-right12-5.flex.flex-70 > div.left-column.layout.layout-column > div.comment.layout.layout-column.ng-scope.main-comment > div.comment-footer.layout.layout-row.layout-align-space-between-center > div.layout.layout-row.layout-align-center-center > button.md-button.md-default-theme")).click();
	    driver.findElement(By.linkText("Flag")).click();
	    driver.findElement(By.id("input_6")).sendKeys("test");
	    driver.findElement(By.cssSelector("div.header.layout.layout-row.layout-align-space-between-center > button.md-raised.md-button.md-default-theme")).click();
	    driver.findElement(By.cssSelector("div.header.layout.layout-row.layout-align-space-between-center > button.md-raised.md-button.md-default-theme")).click();
	    driver.findElement(By.cssSelector("button.projects-header-button.md-button.md-default-theme.active-page")).click();
	    driver.findElement(By.linkText("My Projects")).click();
	    driver.findElement(By.linkText("View All (4)")).click();
	    driver.findElement(By.cssSelector("button.add-button-square.md-button.md-default-theme")).click();
	    driver.findElement(By.id("input_9")).sendKeys("testing new discussion");
	    driver.findElement(By.cssSelector("button.md-raised.md-primary.md-button.md-default-theme")).click();
	    driver.findElement(By.cssSelector("div.layout.layout-row.layout-align-end-end > button.md-raised.md-primary.md-button.md-default-theme")).click();
	    driver.findElement(By.id("input_2")).sendKeys("Does this work?");
	    driver.findElement(By.cssSelector("div.layout.layout-align-end-end > button.md-raised.md-button.md-default-theme")).click();
	  }
	  
	  @After
	  public void tearDown() throws Exception {
	    driver.quit();
	  }
}