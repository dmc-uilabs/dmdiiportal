package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.*;

import java.util.logging.Level;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;

import org.openqa.selenium.WebElement;

public class TaskFunctionalityTest extends BaseTest {

	public void verifyTaskFunctionality(String projectUrl) throws Exception {
		String header = TestUtils.getHeader();
		driver.get(projectUrl);

		NewTaskFromProjectTest tasksForProject = new NewTaskFromProjectTest();
		tasksForProject.testNewTaskFromProject(projectUrl);

		String tasksHome = projectUrl.replace("home", "tasks");
		NewTaskFromTasksPageTest tasksFromList = new NewTaskFromTasksPageTest();
		tasksFromList.testNewTaskFromTasksPage(tasksHome);

		driver.get(projectUrl);

		Thread.sleep(TestUtils.sleep5Second);
		WebElement clickViewAll = driver
				.findElement(By.xpath("/html/body/div[2]/ui-view/div[2]/div/div[1]/div[2]/div[1]/md-toolbar/div/a"));
		jse.executeScript("arguments[0].scrollIntoView(true);", clickViewAll);
		if (clickViewAll.isEnabled()) {
			clickViewAll.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the button View All!!!");
		}


		WebElement numReplies = driver.findElement(By.xpath(
				"/html/body/div[2]/ui-view/div[2]/div/md-content/div[2]/md-data-table-container/table/tbody/tr[2]/td[2]"));
		int replyCount = Integer.parseInt(numReplies.getText().split("\\s+")[0]);
		log.log(Level.INFO, "reply count is " + replyCount);

		// find a discussion
		driver.findElement(By
				.xpath("/html/body/div[2]/ui-view/div[2]/div/md-content/div[2]/md-data-table-container/table/tbody/tr[1]/td[1]/a"))
				.click();
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.linkText("Reply")).click();
		driver.findElement(By.xpath("//textarea")).clear();

		// try replying
		driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium reply");
		driver.findElement(By.xpath("//form/div/div/button[2]")).click();

		// try commenting
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium comment");
		driver.findElement(By.xpath("//form/div/button")).click();

		// try flagging
		WebElement flag = driver.findElement(By.linkText("Flag"));
		jse.executeScript("arguments[0].scrollIntoView(true);", flag);
		if (flag.isEnabled()) {
			flag.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the link Flag!!!");
		}
		WebElement reason = driver.findElement(By.xpath("//md-select"));
		jse.executeScript("arguments[0].scrollIntoView(true);", reason);
		if (reason.isEnabled()) {
			reason.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the link!!!");
		}
		WebElement element = driver.findElement(By.xpath("//md-option"));
		jse.executeScript("arguments[0].scrollIntoView(true);", element);
		if (element.isEnabled()) {
			element.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the link!!!");
		}
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(header + "selenium flag");
		WebElement flagSubmit = driver.findElement(By.xpath("//form/div/div/button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", flagSubmit);
		if (flagSubmit.isEnabled()) {
			flagSubmit.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the link!!!");
		}

		// try clicking like button
		WebElement likeButton = driver
				.findElement(By.xpath("/html/body/div[2]/div/div/div[2]/div[1]/div/div[2]/div[3]/div[2]/button[1]"));
		if (likeButton.isEnabled()) {
			likeButton.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the button Like!!!");
		}

		assertTrue(likeButton.isEnabled());

		// try clicking dislike button
		WebElement dislikeButton = driver
				.findElement(By.xpath("/html/body/div[2]/div/div/div[2]/div[1]/div/div[2]/div[3]/div[2]/button[2]"));
		if (dislikeButton.isEnabled()) {
			dislikeButton.sendKeys(Keys.ENTER);
			;
		} else {
			log.log(Level.SEVERE, "Can not click the button Dislike!!!");
		}

		assertTrue(dislikeButton.isEnabled());

		// try using follow button

		WebElement followUnfollowButton = driver
				.findElement(By.xpath("/html/body/div[2]/div/div/div[2]/div[1]/div/div[1]/button"));
		if (followUnfollowButton.isEnabled()) {
			jse.executeScript("arguments[0].scrollIntoView(true);", followUnfollowButton);
			followUnfollowButton.sendKeys(Keys.ENTER);
		} else {
			log.log(Level.SEVERE, "Can not click the button Follow!!!");
		}

		String click = followUnfollowButton.getText();

		assertTrue(click.toUpperCase().equals("UNFOLLOW"));

		// go to project page and verify that we have a new reply
		driver.get(tasksHome);
		Thread.sleep(TestUtils.sleep5Second);
		numReplies = driver.findElement(By.xpath(
				"/html/body/div[2]/ui-view/div[2]/div/md-content/div[2]/md-data-table-container/table/tbody/tr[1]/td[2]"));
		int newReplyCount = Integer.parseInt(numReplies.getText().split("\\s+")[0]);
		log.log(Level.INFO, "updated reply count is " + newReplyCount);
		assertEquals(newReplyCount, replyCount + 1);
	}

}
