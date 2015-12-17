package com.ge.research.vehicleforge.seleniumtests;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.fail;
import java.util.concurrent.TimeUnit;

/**
 * Created by 200005921 on 12/14/2015.
 */
public class BaseTest {

    public static final String DMC_TITLE_TEXT = "Digital Manufacturing Commons";
    public static final String OPENDMC_TITLE_TEXT = "OPENDMC ";

    // max seconds before failing a script.
    private final int MAX_ATTEMPTS = 5;

    private static boolean enableJavaScript = true;
    protected static HtmlUnitDriver driver;
    protected static String baseUrl;


    @BeforeClass
    public static void setUp() throws Exception {

        String browserName = System.getProperty("browser", "none");

        BrowserVersion version = null;

        if (browserName.equals("none")) {
            // default to Chrome
            version = BrowserVersion.CHROME;
        } else {

            if (browserName.equalsIgnoreCase("chrome")) {
                version = BrowserVersion.CHROME;
            } else if (browserName.equalsIgnoreCase("firefox")) {
                version = BrowserVersion.FIREFOX_38;
            } else if (browserName.equalsIgnoreCase("ie")) {
                version = BrowserVersion.INTERNET_EXPLORER_11;
            } else {
                fail("Unknown browser " + browserName);
            }
            System.out.println("Using browser: " + browserName);
        }

        if (driver == null) {
            driver = new HtmlUnitDriver(version);
            driver.setJavascriptEnabled(enableJavaScript);
        }

        baseUrl = System.getProperty("baseUrl", TestUtils.BASE_URL);
        initSelenium(baseUrl);

    }

    public static void initSelenium(String baseUrl) throws Exception {
        try {
            driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            driver.manage().deleteAllCookies();
            driver.get(baseUrl);

        } catch (Exception e) {
            System.out.println("*** TEST Failure ***");
            System.out.println("URL : " + driver.getCurrentUrl());
            System.out.println("Title : " + driver.getTitle());

            fail(e.getLocalizedMessage());
        }

        System.out.println("URL : " + driver.getCurrentUrl());
        System.out.println("Title : " + driver.getTitle());

    }


    @Test
    public void testTitle () {

        WebElement titleElement = null;
        try {
            if (baseUrl.contains("opendmc.org")) {
                titleElement = driver.findElementByXPath("/html/head/title[text()[contains(., 'OPENDMC')]]");
            } else {
                //titleElement = driver.findElementByXPath("/html/head/title[text() = '" + DMC_TITLE_TEXT + "']");
                titleElement = driver.findElementByXPath("/html/head/title[text()[contains(., '" + DMC_TITLE_TEXT + "')]]");
            }


        } catch (Exception ex) {
            fail("Title element not found!");
        }
        assertTrue(titleElement != null);
    }


    /**
     * Private method that acts as an arbiter of implicit timeouts of sorts.. sort of like a Wait For Ajax method.
     */
    public WebElement waitForElement(By by) {
        int attempts = 0;
        int size = driver.findElements(by).size();

        while (size == 0) {
            size = driver.findElements(by).size();
            if (attempts == MAX_ATTEMPTS) fail(String.format("Could not find %s after %d seconds",
                    by.toString(),
                    MAX_ATTEMPTS));
            attempts++;
            try {
                Thread.sleep(1000); // sleep for 1 second.
            } catch (Exception x) {
                fail("Failed due to an exception during Thread.sleep!");
                x.printStackTrace();
            }
        }

        if (size > 1) System.err.println("WARN: There are more than 1 " + by.toString() + " 's!");

        return driver.findElement(by);
    }

    public BaseTest validatePresent(String css) {
        return validatePresent(By.cssSelector(css));
    }

    public BaseTest validatePresent(By by) {
        waitForElement(by);
        assertTrue("Element " + by.toString() + " does not exist!", isPresent(by));
        return this;
    }

    public BaseTest validateNotPresent(String css) {
        return validateNotPresent(By.cssSelector(css));
    }

    public BaseTest validateNotPresent(By by) {
        assertFalse("Element " + by.toString() + " exists!", isPresent(by));
        return this;
    }

    public boolean isPresent(String css) {
        return isPresent(By.cssSelector(css));
    }

    public boolean isPresent(By by) {
        return driver.findElements(by).size() > 0;
    }
}
