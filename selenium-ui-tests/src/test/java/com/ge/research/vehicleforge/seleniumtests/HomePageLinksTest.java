package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.fail;
import static org.junit.Assert.assertTrue;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

/**
 * @author Amine Chigani
 *
 * Unit tests for navigating through the Home page of the site
 * clicking each link and checking whether the correct page is loaded.
 */
public class HomePageLinksTest extends BaseTest {


    @Test
    public void testDashboard () {

        driver.get(baseUrl);

        // Click on dashboard link
        WebElement dashboardViewButton = null;
        try {

            dashboardViewButton = driver.findElementByXPath("/html/body/div[2]/div[1]/a[1]/button");

        } catch (Exception ex) {
            fail("Dashboard element not found!");
        }
        assertTrue(dashboardViewButton != null);
        dashboardViewButton.click();
        String currentURL = driver.getCurrentUrl();
        assertTrue (currentURL != null);
        assertTrue (currentURL.endsWith("dashboard.php"));

    }

    @Test
    public void testMarketplace () {

        driver.get(baseUrl);

        // Click on marketplace link
        WebElement dashboardViewButton = null;
        try {
            dashboardViewButton = driver.findElementByXPath("/html/body/div[2]/div[2]/a[1]/button");

        } catch (Exception ex) {
            fail("Dashboard element not found!");
        }
        assertTrue(dashboardViewButton != null);
        dashboardViewButton.click();
        String currentURL = driver.getCurrentUrl();
        assertTrue (currentURL != null);
        assertTrue (currentURL.indexOf("marketplace.php") > 0);

    }


}
