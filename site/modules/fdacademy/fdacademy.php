<?php

/**
 * CRM Sumbmission Module
 *
 * Copyright © 2015 Way2CU. All Rights Reserved.
 * Author: Mladen Mijatov, Eyal Gershon
 */
use Core\Module;
use Core\Events;


class fdacademy extends Module {
    private static $_instance;

    /**
     * Constructor
     */
    protected function __construct() {
        parent::__construct(__FILE__);

		$mailer = new FdMailer($this);

		if (class_exists('contact_form'))
			contact_form::getInstance()->registerMailer('fd', $mailer);
    }

    /**
     * Public function that creates a single instance
     */
    public static function getInstance() {
        if (!isset(self::$_instance))
            self::$_instance = new self();

        return self::$_instance;
    }

    /**
     * Transfers control to module functions
     *
     * @param array $params
     * @param array $children
     */
    public function transferControl($params = array(), $children = array()) {
    }

    /**
     * Event triggered upon module initialization
     */
    public function onInit() {
    }

    /**
     * Event triggered upon module deinitialization
     */
    public function onDisable() {
    }

    /**
     * Finalize message and send it to specified addresses.
     *
     * Note: Before sending, you *must* check if contact_form
     * function detectBots returns false.
     *
     * @return boolean
     */
    public function handle_send($mailer, $recipient, $subject, $data) {
    }
}


class FdMailer extends ContactForm_Mailer {
	private $variables;
    private $api_domain = 'crm.zoho.com';
    private $api_path = '/crm/private/xml/Leads/insertRecords?newFormat=1&xmlData=';
	private $parent;


	public function __construct($parent) {
		$this->parent = $parent;
	}

	public function get_title() {
		return 'ZOHO CRM';
	}

	public function start_message() {
	}

	public function send() {
        // prepare data
        $find = array();
        $replace = array();
        foreach ($this->variables as $key => $value) {
            $find[] = '%'.$key.'%';
            $replace[] = $value;
        }

        // prepare content
        $content = file_get_contents($this->parent->path.'data/api.xml');
        $content = str_ireplace($find, $replace, $content);

        $params = array(
            'authtoken'    => 'c01f2b26dd0e6c2ea30be7fefa10979a',
            'scope'        => 'crmapi',
            'xmlData'      => $content
        );

        $content_string = http_build_query($params);

        // make the call
        $header = "POST {$this->api_path} HTTP/1.1\n";
        $header .= "User-Agent: Caracal\n";
        $header .= "Content-Type: application/x-www-form-urlencoded\n";
        $header .= "Content-Length: " . strlen($content_string) . "\n";
        $header .= "Host: ".$this->api_domain."\n";
        $header .= "Connection: close\n\n";

        $socket = fsockopen('ssl://'.$this->api_domain, 443, $error_number, $error_string, 5);


        if ($socket) {
            // send and receive data
            fputs($socket, $header.$content_string);
            $response = stream_get_contents($socket, 1024);
            trigger_error($response, E_USER_NOTICE);
            fclose($socket);
        }

		return true;
	}

	public function set_sender($address, $name=null) {
	}

	public function add_recipient($address, $name=null) {
	}

	public function add_cc_recipient($address, $name=null) {
	}

	public function add_bcc_recipient($address, $name=null) {
	}

	public function add_header_string($key, $value) {
	}

	public function set_subject($subject) {
	}

	public function set_variables($variables) {
		$this->variables = $variables;
	}

	public function set_body($plain_body, $html_body=null) {
	}

	public function attach_file($file_name, $attached_name=null, $inline=false) {
	}
}
