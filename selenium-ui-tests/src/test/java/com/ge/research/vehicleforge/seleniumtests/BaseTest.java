package com.ge.research.vehicleforge.seleniumtests;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import java.util.concurrent.TimeUnit;

/**
 * Created by 200005921 on 12/14/2015.
 */
public class BaseTest {

    static HtmlUnitDriver driver;
    static String baseUrl;
    static StringBuffer verificationErrors = new StringBuffer();


    @BeforeClass
    public static void setUp() throws Exception {
        String browserName = System.getProperty("browser", "none").toLowerCase();


        if (browserName.equals("none")) {
            driver = new HtmlUnitDriver(TestUtils.ENABLE_JAVASCRIPT);
        } else {
            BrowserVersion version = null;
            if (browserName.equals("chrome")) {
                version = BrowserVersion.CHROME;
            } else if (browserName.equals("firefox")) {
                version = BrowserVersion.FIREFOX_38;
            } else if (browserName.equals("ie")) {
                version = BrowserVersion.INTERNET_EXPLORER_11;
            } else {
                fail("Unknown browser " + browserName);
            }
            System.out.println("Using browser: " + browserName + ":" + version);
            driver = new HtmlUnitDriver(version);//org.openqa.selenium.chrome.ChromeDriver);//System.getProperty("browser"); //TestUtils.ENABLE_JAVASCRIPT);
            //driver.setProxy("proxy.research.ge.com", 8080);
        }


        baseUrl = TestUtils.BASE_URL;
        driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        RegisterSelenium();

    }

    public static void RegisterSelenium() throws Exception {
        try {
            driver.manage().deleteAllCookies();

            driver.get(baseUrl);

//            if (!driver.getCurrentUrl().endsWith("index2.php")) {
//                fail(" Public logging into the system has failed. " + driver.getCurrentUrl());
//            }


        } catch (Exception e) {
            System.out.println("*** TEST Failure ***");
            System.out.println("URL : " + driver.getCurrentUrl());
            System.out.println("Title : " + driver.getTitle());

            fail(e.getLocalizedMessage());
        }

        System.out.println("URL : " + driver.getCurrentUrl());
        System.out.println("Title : " + driver.getTitle());


        // /html/head/title
        WebElement titleElement = driver.findElementByXPath("/html/head/title");
        System.out.println(titleElement.toString());
        assertTrue(TestUtils.TITLE_DMC.equalsIgnoreCase(titleElement.getText()));

        //assertTrue(driver.getCurrentUrl().endsWith("index2.php"));

        //Register Selenium Tester Account
        //driver.findElement(By.linkText("Register")).click();
        //assertTrue(driver.getCurrentUrl().endsWith("account/register2.php"));
    }

}
