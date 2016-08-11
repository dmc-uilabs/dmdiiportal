package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class MenuNavigationTest extends BaseTest {

	@Ignore
	@Test
	public void testMenuNavigation() throws Exception {
		// Test Dashboard
		driver.findElement(By.xpath("html/body/div[1]/header/div[2]/div/div/div/div/a[1]/span")).click();
		assertEquals("Dashboard", driver.getTitle());
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
		// Test Marketplace -> Home
		Thread.sleep(TestUtils.sleep3Second);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
		assertEquals("Marketplace", driver.getTitle());

		// Test Marketplace -> My Storefront
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();
		assertEquals("Company", driver.getTitle());

		// Test Marketplace -> Favorites
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu/button")).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span"))).click();
		assertEquals("All Favorites", driver.getTitle());

		// Test Community
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//a[2]/span")).click();
		assertEquals("Community", driver.getTitle());

		// Test Projects -> My Projects
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[1]/a/span"))).click();
		assertEquals("My Projects", driver.getTitle());

		// Test Projects -> All Projects
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
		// wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[2]/a/span"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.linkText("All Projects"))).click();
		assertEquals("All Projects", driver.getTitle());

		// Test Members -> Member Directory
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[3]/button")).click();
		// wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.linkText("Member Directory"))).click();
		assertEquals("Member Directory", driver.getTitle());

		// Not implemented Members -> DMDII Projects
		/*
		 * driver.findElement(By.xpath(
		 * "//div[2]/div/div/div/div/md-menu[3]/button")).click();
		 * wait.until(ExpectedConditions.elementToBeClickable(By.xpath(
		 * "//md-menu-item[2]/a/span"))).click();
		 */

	}

}
