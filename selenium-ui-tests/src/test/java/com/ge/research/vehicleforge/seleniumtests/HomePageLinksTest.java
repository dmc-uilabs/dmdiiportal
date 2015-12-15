package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.fail;
import static org.junit.Assert.assertTrue;
import org.junit.Test;
import org.openqa.selenium.By;

/**
 * @author Amine Chigani
 * 
 * Unit tests for navigating through the Home page of the site
 * clicking each link and checking whether the correct page is loaded. 
 */
public class HomePageLinksTest extends BaseTest {
    
	@Test
    public void testHomePageLinks() throws Exception {

        //testForgeLogin();
        
 
        // Click on the Home tab after login.
        driver.findElement(By.linkText("Home")).click();
        if (!driver.getCurrentUrl().endsWith("index2.php")) {
            fail("Doesn't go to the Home page when the Home tab is clicked.");
        }
        
        
        // Click on "Projects" link and check whether the correct page is loaded.
        driver.findElement(By.xpath(".//*[@id='body']/div[1]/div[3]/div/div[2]/div[2]/div/div[2]/a/strong")).click();
        assertTrue(driver.getCurrentUrl().endsWith("softwaremap/full_list.php"));
        driver.findElement(By.linkText("Home")).click();
        
        // Click on "View Site Activity" link and check whether the correct page is loaded.
        driver.findElement(By.linkText("View Site Activity")).click();
        if (!driver.getCurrentUrl().endsWith("site_activity.php")) {
            fail("Doesn't go to the View Site Activity page.");
        }
        
        
        //Return to Home page and then continue check the following link within homepage.
        driver.findElement(By.linkText("Home")).click();
        driver.findElement(By.linkText("All newest projects")).click();
        assertTrue(driver.getCurrentUrl().endsWith("softwaremap/full_list.php"));
       
        
        
       // Reurn to Home page and then click on a user.
        driver.findElement(By.linkText("Home")).click();
               
       
	}
}
