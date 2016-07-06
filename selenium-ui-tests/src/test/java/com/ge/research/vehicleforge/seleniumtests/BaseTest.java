package com.ge.research.vehicleforge.seleniumtests;


import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.RemoteWebDriver;
import com.gargoylesoftware.htmlunit.BrowserVersion;

import static org.junit.Assert.*;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by 200005921 on 12/14/2015.
 */
public abstract class BaseTest {


   /* public static final String DMC_TITLE_TEXT = "Digital Manufacturing Commons";
    public static final String OPENDMC_TITLE_TEXT = "OPENDMC ";*/

    // max seconds before failing a script.
    private final int MAX_ATTEMPTS = 5;

    //static HtmlUnitDriver driver;
    static RemoteWebDriver driver;
    static String baseUrl;
    static StringBuffer verificationErrors = new StringBuffer();
    static String browserName = System.getenv("browser").toLowerCase();
    public static Logger log = Logger.getGlobal();


    @BeforeClass
    public static void setUp() throws Exception {

    	// System.getProperty() is used for get system properties defined with -D in bamboo Maven task Goal field.
    	//String browserName = System.getProperty("browser").toLowerCase();
    	log.log(Level.INFO, "set up");
		log.log(Level.INFO, "Get browser from maven build: " + browserName);
		BrowserVersion version = null;


            if (browserName.equals("chrome")) {
                version = BrowserVersion.CHROME;
                System.setProperty("webdriver.chrome.driver", "C:/Program Files (x86)/chromedriver.exe");
                driver = new ChromeDriver();
                driver.manage().window().maximize();
            } else if (browserName.equals("firefox")) {
                driver = new FirefoxDriver();
                driver.manage().window().maximize();
            } else if (browserName.equals("ie")) {
                version = BrowserVersion.INTERNET_EXPLORER_11;
            	//driver = new InternetExplorerDriver();
            } else if(browserName.equals("safari")){
            	//driver = new SafariDriver();
            }else {
                fail("Unknown browser " + browserName);
            }

          log.log(Level.INFO, "version name is: " + version);
          baseUrl = System.getenv("baseUrl");
          System.out.println("The first step to get Url from system environment : " + baseUrl);

        driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        testDMCLogin();

    }


    /**
     * Test the login page that protects the overall site from public access.
     */
    public final static void testPublicLoginProtection() throws Exception {

    	try {
    		driver.manage().deleteAllCookies();

            driver.get(baseUrl);
            Thread.sleep(3000);

            if (browserName.equals("firefox")) {
				driver.findElement(By.xpath("html/body/div[4]/md-dialog")).sendKeys(Keys.ESCAPE);
			}else if(browserName.equals("chrome")){
				Actions action = new Actions(driver);
				action.sendKeys(Keys.ESCAPE).build().perform();
			}
			

			log.log(Level.INFO, "The public login protection link URL : " + driver.getCurrentUrl());

        } catch (Exception e) {
        	log.log(Level.SEVERE, "*** TEST Failure ***");
			log.log(Level.SEVERE, "URL : " + driver.getCurrentUrl());
			log.log(Level.SEVERE, "Title : " + driver.getTitle());

			fail(e.getLocalizedMessage());
        }

    }


    public static void testDMCLogin() throws Exception{
    	if (TestUtils.CREDENTIAL_GATEWAY_REQUIRED) {
            testPublicLoginProtection();
        }
 	   else {

    		driver.manage().deleteAllCookies();
 	   }

    	Thread.sleep(1000);
    	// logout
    	driver.findElement(By.xpath("html/body/div[1]/header/div[2]/div/div/div/div/a[1]/span")).click();
    	Thread.sleep(5000);
	    driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
	    WebElement logout = driver.findElement(By.xpath("//md-menu-item[4]/button"));
	    logout.sendKeys(Keys.ENTER);;


	    //login
		driver.findElement(By.xpath("//a/span")).click();
		driver.findElement(By.linkText("Google")).click();
		Thread.sleep(2000);
		driver.findElement(By.id("Email")).clear();
		driver.findElement(By.id("Email")).sendKeys(System.getenv("credential_user"));
		driver.findElement(By.id("next")).click();
		if (browserName.equals("firefox")) {
			driver.findElement(By.id("Passwd")).clear();
		}
		driver.findElement(By.id("Passwd")).sendKeys(System.getenv("credential_pass"));
		driver.findElement(By.id("signIn")).click();
		// System.out.println("*** TEST Completed ***");

    }
    
    
  public void TestOnBoarding() throws Exception{
		Thread.sleep(3000);

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
		// driver.findElement(By.xpath("//div[2]/button")).click();
		Thread.sleep(1000);
		WebElement e = driver.findElement(By.xpath("//div[2]/button"));
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", e);
		JavascriptExecutor executor = (JavascriptExecutor) driver;
		executor.executeScript("arguments[0].click();", e);

		log.log(Level.INFO, "The title after login is:" + driver.getTitle());
		log.log(Level.INFO, "The current URL after login : " + driver.getCurrentUrl());


    }
  
  
  @AfterClass
  public static void tearDown() throws Exception {
      driver.quit();
      String verificationErrorString = verificationErrors.toString();
      if (!"".equals(verificationErrorString)) {
        fail(verificationErrorString);
      }
    }


}
