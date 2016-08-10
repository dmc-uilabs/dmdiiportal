package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;
import org.junit.Ignore;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProfileTest extends BaseTest {

	WebDriverWait wait = new WebDriverWait(driver, 20);

	public void myProfile() throws Exception {
		/*driver.get(baseUrl + "/dashboard.php#/");
		Thread.sleep(3000);*/
		driver.findElement(By.xpath("//div[3]/md-menu/button")).sendKeys(Keys.ENTER);
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span")));
		element.click();
		log.log(Level.INFO, "Get current title:" + driver.getTitle());
		assertEquals("Profile", driver.getTitle());
	}

	public void testMyProfile() throws Exception {
		// navigate to myProfile
		myProfile();

		// validate HISTORY, SKILLS, CONTRACT
		assertEquals("HISTORY", driver.findElement(By.xpath("//md-tab-item/span")).getText());

		driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
		assertEquals("SKILLS", driver.findElement(By.xpath("//md-tab-item[2]/span")).getText());
		/*
		 * driver.findElement(By.xpath("//md-tab-item[3]")).click();
		 * assertEquals("CONTACT",
		 * driver.findElement(By.xpath("//md-tab-item[3]/span")).getText());
		 */

		// Edit profile
		driver.findElement(By.xpath("//div[2]/a/span")).click();
		driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//div/md-input-container/input")).clear();
		driver.findElement(By.xpath("//div/md-input-container/input")).sendKeys("Thomas Smith");
		driver.findElement(By.xpath("//md-input-container[2]/input")).clear();
		driver.findElement(By.xpath("//md-input-container[2]/input")).sendKeys("Engineering Manager");
		driver.findElement(By.xpath("//div[2]/div/md-input-container[2]/input")).clear();
		driver.findElement(By.xpath("//div[2]/div/md-input-container[2]/input")).sendKeys("Berkeley, California");

		String skill = "skill" + TestUtils.ran;
		driver.findElement(By.xpath("//md-content/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//md-content/div/form/md-input-container/input")).sendKeys(skill);
		driver.findElement(By.xpath("//md-content/div/form/button")).click();

		driver.findElement(By.xpath("//button[2]")).click();
		assertEquals("Thomas Smith Engineering Manager", driver.findElement(By.xpath("//h2")).getText());
		assertEquals("Berkeley, California", driver.findElement(By.xpath("//h3[2]")).getText());
		driver.findElement(By.xpath("//md-tab-item[2]/span")).click();
		assertTrue(driver.findElement(By.cssSelector("BODY")).getText().matches("^[\\s\\S]*" + skill + "[\\s\\S]*$"));

		// Follow and Unfollow
		driver.findElement(By.xpath("//div[2]/button")).click();
		assertEquals("UNFOLLOW", driver.findElement(By.xpath("//div[2]/button")).getText());
		driver.findElement(By.xpath("//div[2]/button")).click();
		assertEquals("FOLLOW", driver.findElement(By.xpath("//div[2]/button")).getText());

		// Invite to project
		driver.findElement(By.xpath("//div[2]/button[2]")).click();
		driver.findElement(By.xpath("//md-select")).click();
		driver.findElement(By.xpath("//md-option/div")).click();
		driver.findElement(By.xpath("//div[2]/button[2]")).click();
		assertEquals("Capacitor Bank for LDR Mining Co.",
				driver.findElement(By.xpath("//a[contains(text(),'Capacitor Bank for LDR Mining Co.')]")).getText());

		// delete from project
		driver.findElement(By.xpath("//div[2]/button[2]")).click();
		assertEquals("INVITE TO PROJECT", driver.findElement(By.xpath("//div[2]/button[2]")).getText());

	}

	public void testMyProfileReview() throws Exception {
		myProfile();

		assertEquals("Most recent",
				driver.findElement(By.xpath("//md-input-container/md-select/md-select-value/span")).getText());

		// click LEAVE A REVIEW
		driver.findElement(By.xpath("//div[3]/div[2]/button")).sendKeys(Keys.ENTER);
		// Rating
		driver.findElement(By.xpath("//form/div/div/button[5]")).sendKeys(Keys.ENTER);

		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys("This is test comment!" + TestUtils.ran);
		// cancel
		driver.findElement(By.xpath("//form/div[2]/button")).click();

		// click LEAVE A REVIEW second time
		driver.findElement(By.xpath("//div[3]/div[2]/button")).sendKeys(Keys.ENTER);
		driver.findElement(By.xpath("//form/div/div/button[5]")).sendKeys(Keys.ENTER);
		driver.findElement(By.xpath("//textarea")).clear();
		Integer commentNum = TestUtils.ran;
		driver.findElement(By.xpath("//textarea")).sendKeys("This is test comments!" + commentNum);
		System.out.println(commentNum);
		driver.findElement(By.xpath("//form/div[2]/button[2]")).click();

		driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
		// leave comment feature not implemented yet
		/*
		 * assertTrue(driver.findElement(By.cssSelector("BODY")).getText().
		 * matches("^[\\s\\S]*"+ commentNum + "[\\s\\S]*$"));
		 */
	}

	public void testMyProfileSorting() throws Exception {
		driver.get(baseUrl);
		myProfile();

		// test sorting features
		assertEquals("Most recent",
				driver.findElement(By.xpath("//md-input-container/md-select/md-select-value/span")).getText());
		driver.manage().timeouts().implicitlyWait(TestUtils.DEFAULT_IMPLICIT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
		WebElement e = driver.findElement(By.id("select_value_label_2"));
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", e);
		JavascriptExecutor executor = (JavascriptExecutor) driver;

		// test for sorting by Most Helpful
		executor.executeScript("arguments[0].click();", e);
		driver.findElement(By.xpath("//md-option[2]/div")).click();

		// test for sorting by Highest to Lowest Rating
		executor.executeScript("arguments[0].click();", e);
		driver.findElement(By.xpath("//md-option[3]/div")).click();

		// test for sorting by Lowest to Highest Rating
		executor.executeScript("arguments[0].click();", e);
		driver.findElement(By.xpath("//md-option[4]/div")).click();

		// test for sorting by Verified Users
		executor.executeScript("arguments[0].click();", e);
		driver.findElement(By.xpath("//md-option[5]/div")).click();

		executor.executeScript("arguments[0].click();", e);
		driver.findElement(By.xpath("//md-option[2]/div")).click();

	}

	@Ignore
	@Test
	public void testMyProfileAll() throws Exception {
		// testMyProfile();
		testMyProfileReview();
		testMyProfileSorting();

	}

}
