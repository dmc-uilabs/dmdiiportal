package com.ge.research.vehicleforge.seleniumtests;


import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import com.gargoylesoftware.htmlunit.BrowserVersion;

import static org.junit.Assert.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by 200005921 on 12/14/2015.
 */
public abstract class BaseTest {

   /*public static final String DMC_TITLE_TEXT = "Digital Manufacturing Commons";
    public static final String OPENDMC_TITLE_TEXT = "OPENDMC ";*/

    // max seconds before failing a script.
    private final int MAX_ATTEMPTS = 5;

    //static HtmlUnitDriver driver;
    static RemoteWebDriver driver;
    static String baseUrl;   
    static StringBuffer verificationErrors = new StringBuffer();


    @BeforeClass
    public static void setUp() throws Exception {

    	// System.getProperty() is used for get system properties defined with -D in bamboo Maven task Goal field.
    	//String browserName = System.getProperty("browser").toLowerCase();
    	String browserName = System.getenv("browser").toLowerCase();

    	
    	System.out.println("Get browser from maven build: " + browserName);
        BrowserVersion version = null;
        
            if (browserName.equals("chrome")) {
                version = BrowserVersion.CHROME;
                System.setProperty("webdriver.chrome.driver", "C:/Program Files (x86)/chromedriver.exe");
                driver = new ChromeDriver();
            } else if (browserName.equals("firefox")) {
                driver = new FirefoxDriver();
                driver.manage().window().maximize();;
            } else if (browserName.equals("ie")) {
                version = BrowserVersion.INTERNET_EXPLORER_11;
            	//driver = new InternetExplorerDriver();
            } else if(browserName.equals("safari")){
            	//driver = new SafariDriver();
            }else {
                fail("Unknown browser " + browserName);
            }
            
            System.out.println("version name is: " + version);
            
           /* driver = new HtmlUnitDriver(version);
            driver.setJavascriptEnabled(TestUtils.ENABLE_JAVASCRIPT);*/
           

          baseUrl = System.getenv("baseUrl");
          System.out.println("The first step to get Url from system environment : " + baseUrl);
  
      
        driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        initSelenium();

    }

    public static void initSelenium() throws Exception {
        try {
        	
            driver.manage().deleteAllCookies();            
            driver.get(baseUrl);
            
        } catch (Exception e) {
            System.out.println("*** TEST Failure New***");
            System.out.println("URL : " + driver.getCurrentUrl());
            System.out.println("Title : " + driver.getTitle());

            fail(e.getLocalizedMessage());
        }

        System.out.println("Initial URL : " + driver.getCurrentUrl());
        System.out.println("Initial Title : " + driver.getTitle());

    }

    @AfterClass
    public static void tearDown() throws Exception {
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
            
            System.out.println("The public login protection link URL : " + driver.getCurrentUrl());
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
            System.out.println("*** TEST Failure ***");
            System.out.println("URL : " + driver.getCurrentUrl());
            System.out.println("Title : " + driver.getTitle());

            fail(e.getLocalizedMessage());
        }
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
	    logout.sendKeys(Keys.ENTER);
	    
	   
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
	    System.out.println("*** TEST Completed ***");
	    
	
	
    }
    
    
    public void TestOnBoarding() throws Exception{
    	
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
	
	    
	    System.out.println("The title after login is:" + driver.getTitle());
	    System.out.println("The current URL after login : " + driver.getCurrentUrl());
	    assertEquals("Onboarding", driver.getTitle());
	    assertEquals("Welcome to the Digital Manufacturing Commons A collaboration community to drive advanced system engineering.", 
	    		driver.findElement(By.xpath("//md-content/div/div")).getText());
    	
    }
    
}
