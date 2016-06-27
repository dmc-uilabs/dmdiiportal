package com.ge.research.vehicleforge.seleniumtests;


import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.firefox.FirefoxDriver;

import org.openqa.selenium.interactions.Actions;

import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariDriver;
import com.gargoylesoftware.htmlunit.BrowserVersion;

import static org.junit.Assert.*;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by 200005921 on 12/14/2015.
 */
@SuppressWarnings("unused")
public abstract class BaseTest {


	/*public static final String DMC_TITLE_TEXT = "Digital Manufacturing Commons";
    public static final String OPENDMC_TITLE_TEXT = "OPENDMC ";*/

	// max seconds before failing a script.
	private final int MAX_ATTEMPTS = 5;

	//static HtmlUnitDriver driver;
	static RemoteWebDriver driver;
	static String baseUrl;   
	static StringBuffer verificationErrors = new StringBuffer();
	public static Logger log = Logger.getGlobal();
	Actions actions;


	@Before
	public void setUp() throws Exception {

		// System.getProperty() is used for get system properties defined with -D in bamboo Maven task Goal field.
		//String browserName = System.getProperty("browser").toLowerCase();
		String browserName = System.getenv("browser").toLowerCase();
		

		log.log(Level.INFO, "set up");
		log.log(Level.INFO,"Get browser from maven build: " + browserName);
		String version = null;
		if (browserName.equals("chrome")) {
			version = "chrome";
			System.setProperty("webdriver.chrome.driver", "C:/Program Files (x86)/chromedriver.exe");
			driver = new ChromeDriver();
		} else if (browserName.equals("firefox")) {
			driver = new FirefoxDriver();
			driver.manage().window().maximize();
		} else if (browserName.equals("ie")) {
			version = "Internet Explorer";
			//driver = new InternetExplorerDriver();
		} else if(browserName.equals("safari")){
			//driver = new SafariDriver();
		}else {
			fail("Unknown browser " + browserName);
		}

		log.log(Level.INFO,"version name is: " + version);

		/* driver = new HtmlUnitDriver(version);
            driver.setJavascriptEnabled(TestUtils.ENABLE_JAVASCRIPT);*/
	}


   

   

	public static void initSelenium() throws Exception {
		try {

			driver.manage().deleteAllCookies();            
			driver.get(baseUrl);

		} catch (Exception e) {
			log.log(Level.INFO,"*** TEST Failure New***");
			log.log(Level.INFO,"URL : " + driver.getCurrentUrl());
			log.log(Level.INFO,"Title : " + driver.getTitle());

			fail(e.getLocalizedMessage());
		}

		log.log(Level.INFO,"Initial URL : " + driver.getCurrentUrl());
		log.log(Level.INFO,"Initial Title : " + driver.getTitle());

	}

	@After
    public void tearDown() throws Exception {
        driver.quit();
        String verificationErrorString = verificationErrors.toString();
        if (!"".equals(verificationErrorString)) {
          fail(verificationErrorString);
        }
      }




	/**
	 * Test the login page that protects the overall site from public access.
	 */

    //@Test
    public final void testPublicLoginProtection() throws Exception {

    	try {
    		driver.manage().deleteAllCookies();

            driver.get(baseUrl);

            log.log(Level.INFO,"The public login protection link URL : " + driver.getCurrentUrl());
            /**

            WebElement element = driver.findElement(By.name("user"));
            element.click();
            element.sendKeys(TestUtils.CREDENTIAL_GATEWAY_USER);

            element = driver.findElement(By.name("pass"));
            element.click();
            element.sendKeys(TestUtils.CREDENTIAL_GATEWAY_PASS);

            element = driver.findElement(By.name("login"));
            element.submit();
			 **/

		} catch (Exception e) {
			log.log(Level.INFO,"*** TEST Failure ***");
			log.log(Level.INFO,"URL : " + driver.getCurrentUrl());
			log.log(Level.INFO,"Title : " + driver.getTitle());

			fail(e.getLocalizedMessage());
		}
	}


	


	public void TestOnBoarding(){

		// driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
		driver.findElement(By.id("input_2")).clear();
		driver.findElement(By.id("input_2")).sendKeys("Test First Name");
		driver.findElement(By.id("input_3")).clear();
		driver.findElement(By.id("input_3")).sendKeys("Test Last Name");
		driver.findElement(By.id("input_4")).clear();
		driver.findElement(By.id("input_4")).sendKeys("dmcuser01@gmail.com");
		driver.findElement(By.id("select_6")).click();
		driver.findElement(By.id("select_option_8")).click();
		driver.findElement(By.xpath("//div[2]/button")).click();
		driver.findElement(By.xpath("//div[2]/button")).click();


		log.log(Level.INFO,"The title after login is:" + driver.getTitle());
		log.log(Level.INFO,"The current URL after login : " + driver.getCurrentUrl());
		assertEquals("Onboarding", driver.getTitle());
		assertEquals("Welcome to the Digital Manufacturing Commons A collaboration community to drive advanced system engineering.", 
				driver.findElement(By.xpath("//md-content/div/div")).getText());

	}

            

  


   // @Test
    public void testDMCLogin() throws Exception{
    	if (TestUtils.CREDENTIAL_GATEWAY_REQUIRED) {
            testPublicLoginProtection();
        }
 	   else {

    		driver.manage().deleteAllCookies();
 	   }


    	// logout
	    driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
	    WebElement logout = driver.findElement(By.xpath("//md-menu-item[4]/button"));
	    logout.sendKeys(Keys.ENTER);;

	    //System.out.print(driver.getPageSource());

	    //login
	    driver.findElement(By.xpath("//a/span")).click();
	   // driver.findElementByLinkText("Login").click();
	 driver.findElement(By.linkText("Google")).click();
	      driver.findElement(By.id("Email")).clear();
	    driver.findElement(By.id("Email")).sendKeys(System.getenv("credential_user"));
	    driver.findElement(By.id("next")).click();
	    driver.findElement(By.id("Passwd")).clear();
	    driver.findElement(By.id("Passwd")).sendKeys(System.getenv("credential_pass"));
	    driver.findElement(By.id("signIn")).click();
	    log.log(Level.INFO,"*** TEST Completed ***");

	 /*   driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
	    //driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
	    driver.findElement(By.id("input_2")).clear();
	    driver.findElement(By.id("input_2")).sendKeys("Test First Name");
	    driver.findElement(By.id("input_3")).clear();
	    driver.findElement(By.id("input_3")).sendKeys("Test Last Name");
	    driver.findElement(By.id("input_4")).clear();
	    driver.findElement(By.id("input_4")).sendKeys("dmcuser01@gmail.com");
	    driver.findElement(By.id("select_6")).click();
	    driver.findElement(By.id("select_option_8")).click();
	    driver.findElement(By.xpath("//div[2]/button")).click();
	    driver.findElement(By.xpath("//div[2]/button")).click();



	    log.log(Level.INFO,"The title after login is:" + driver.getTitle());
	    log.log(Level.INFO,"The current URL after login : " + driver.getCurrentUrl());
	    assertEquals("Onboarding", driver.getTitle());
	    assertEquals("Welcome to the Digital Manufacturing Commons A collaboration community to drive advanced system engineering.",
	    		driver.findElement(By.xpath("//md-content/div/div")).getText());

	    assertEquals("Welcome to the Digital Manufacturing Commons A collaboration community to drive advanced system engineering.", driver.findElement(By.xpath("//md-content/div/div")).getText());*/
    }

}
