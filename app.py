import os
from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError


load_dotenv(override=True)

AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
KB_ID = os.getenv("KB_ID")
MODEL_ARN = os.getenv("MODEL_ARN")

if not KB_ID:
	raise ValueError("KB_ID is missing. Set it in .env")

if not MODEL_ARN:
	raise ValueError("MODEL_ARN is missing. Set it in .env")

if KB_ID.upper().startswith("YOUR_"):
	raise ValueError("KB_ID still has placeholder value. Set real Knowledge Base ID in .env")

if "foundation-model/" not in MODEL_ARN:
	raise ValueError("MODEL_ARN must be a Bedrock foundation model ARN")

app = Flask(__name__)

# Allow React dev server and any configured frontend origins.
CORS(
	app,
	resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
)

bedrock_agent_runtime = boto3.client("bedrock-agent-runtime", region_name=AWS_REGION)
bedrock_agent = boto3.client("bedrock-agent", region_name=AWS_REGION)
bedrock = boto3.client("bedrock", region_name=AWS_REGION)


@app.get("/")
def home():
	return jsonify(
		{
			"message": "Backend is running",
			"endpoints": {
				"health": "/api/health",
				"query": "/api/query",
			},
		}
	)


@app.get("/api/health")
def health():
	return jsonify({"status": "ok", "region": AWS_REGION})


@app.get("/api/config-check")
def config_check():
	model_id = MODEL_ARN.split("foundation-model/")[-1] if "foundation-model/" in MODEL_ARN else MODEL_ARN
	result = {
		"region": AWS_REGION,
		"knowledgeBaseId": KB_ID,
		"modelArn": MODEL_ARN,
		"modelId": model_id,
		"checks": {},
	}

	# 1) Check whether KB exists and is accessible.
	try:
		kb = bedrock_agent.get_knowledge_base(knowledgeBaseId=KB_ID)
		kb_info = kb.get("knowledgeBase", {})
		result["checks"]["knowledgeBase"] = {
			"ok": True,
			"status": kb_info.get("status"),
			"name": kb_info.get("name"),
		}
	except ClientError as exc:
		error_info = exc.response.get("Error", {})
		result["checks"]["knowledgeBase"] = {
			"ok": False,
			"code": error_info.get("Code", "ClientError"),
			"message": error_info.get("Message", str(exc)),
		}

	# 2) Check whether model is visible/accessible in this region.
	try:
		fm = bedrock.get_foundation_model(modelIdentifier=model_id)
		model_details = fm.get("modelDetails", {})
		result["checks"]["model"] = {
			"ok": True,
			"provider": model_details.get("providerName"),
			"responseStreamingSupported": model_details.get("responseStreamingSupported"),
		}
	except ClientError as exc:
		error_info = exc.response.get("Error", {})
		result["checks"]["model"] = {
			"ok": False,
			"code": error_info.get("Code", "ClientError"),
			"message": error_info.get("Message", str(exc)),
		}

	# 3) Retrieval-only test isolates KB/vector issues from generation-model issues.
	try:
		retr = bedrock_agent_runtime.retrieve(
			knowledgeBaseId=KB_ID,
			retrievalQuery={"text": "health check"},
			retrievalConfiguration={
				"vectorSearchConfiguration": {
					"numberOfResults": 5,
					"overrideSearchType": "SEMANTIC",
				}
			},
		)
		results = retr.get("retrievalResults", [])
		result["checks"]["retrieve"] = {
			"ok": True,
			"resultsFound": len(results),
		}
	except ClientError as exc:
		error_info = exc.response.get("Error", {})
		result["checks"]["retrieve"] = {
			"ok": False,
			"code": error_info.get("Code", "ClientError"),
			"message": error_info.get("Message", str(exc)),
		}

	# 4) Data source and ingestion status help detect unsynced/failed KBs.
	try:
		ds_response = bedrock_agent.list_data_sources(knowledgeBaseId=KB_ID, maxResults=20)
		data_sources = []
		for ds in ds_response.get("dataSourceSummaries", []):
			ds_id = ds.get("dataSourceId")
			ds_item = {
				"dataSourceId": ds_id,
				"name": ds.get("name"),
				"status": ds.get("status"),
			}

			if ds_id:
				try:
					jobs = bedrock_agent.list_ingestion_jobs(
						knowledgeBaseId=KB_ID,
						dataSourceId=ds_id,
						maxResults=1,
					)
					latest_job = (jobs.get("ingestionJobSummaries") or [None])[0]
					if latest_job:
						ds_item["latestIngestionJob"] = {
							"status": latest_job.get("status"),
							"updatedAt": str(latest_job.get("updatedAt")),
							"failureReasons": latest_job.get("failureReasons", []),
						}
				except ClientError as exc:
					error_info = exc.response.get("Error", {})
					ds_item["latestIngestionJob"] = {
						"status": "UNKNOWN",
						"error": error_info.get("Message", str(exc)),
					}

			data_sources.append(ds_item)

		result["checks"]["dataSources"] = {"ok": True, "items": data_sources}
	except ClientError as exc:
		error_info = exc.response.get("Error", {})
		result["checks"]["dataSources"] = {
			"ok": False,
			"code": error_info.get("Code", "ClientError"),
			"message": error_info.get("Message", str(exc)),
		}

	all_ok = all(check.get("ok") for check in result["checks"].values())
	status_code = 200 if all_ok else 400
	return jsonify(result), status_code


@app.get("/test")
def test_page():
	return render_template_string(
		"""
		<!doctype html>
		<html>
		<head>
			<meta charset=\"utf-8\" />
			<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
			<title>KB Test</title>
			<style>
				body { font-family: Segoe UI, sans-serif; max-width: 720px; margin: 32px auto; padding: 0 16px; }
				textarea { width: 100%; min-height: 120px; margin: 8px 0 12px; }
				button { padding: 10px 16px; cursor: pointer; }
				pre { background: #f4f6f8; padding: 12px; white-space: pre-wrap; border-radius: 8px; }
			</style>
		</head>
		<body>
			<h2>Knowledge Base Test</h2>
			<p>Enter a question and click Ask.</p>
			<textarea id=\"query\" placeholder=\"Type your question...\"></textarea>
			<br />
			<button id=\"askBtn\">Ask</button>
			<h3>Answer</h3>
			<pre id=\"answer\">No response yet.</pre>

			<script>
				document.getElementById("askBtn").addEventListener("click", async () => {
					const query = document.getElementById("query").value.trim();
					const answerEl = document.getElementById("answer");
					if (!query) {
						answerEl.textContent = "Please enter a query.";
						return;
					}

					answerEl.textContent = "Loading...";
					try {
						const res = await fetch("/api/query", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ query })
						});
						const data = await res.json();
						if (!res.ok) {
							answerEl.textContent = data.error || "Request failed";
							return;
						}
						answerEl.textContent = data.answer || "No answer returned";
					} catch (err) {
						answerEl.textContent = err.message;
					}
				});
			</script>
		</body>
		</html>
		"""
	)


@app.post("/api/query")
def query_knowledge_base():
	data = request.get_json(silent=True) or {}
	user_query = (data.get("query") or "").strip()

	if not user_query:
		return jsonify({"error": "No query provided"}), 400

	try:
		response = bedrock_agent_runtime.retrieve_and_generate(
			input={"text": user_query},
			retrieveAndGenerateConfiguration={
				"type": "KNOWLEDGE_BASE",
				"knowledgeBaseConfiguration": {
					"knowledgeBaseId": KB_ID,
					"modelArn": MODEL_ARN,
					"retrievalConfiguration": {
						"vectorSearchConfiguration": {
							"numberOfResults": 5,
							"overrideSearchType": "SEMANTIC",
						}
					},
					"generationConfiguration": {
						"inferenceConfig": {
							"textInferenceConfig": {
								"maxTokens": 400,
								"temperature": 0.2,
							}
						}
					},
				},
			},
		)

		answer = response.get("output", {}).get("text", "")

		citations = []
		for citation in response.get("citations", []):
			refs = citation.get("retrievedReferences", [])
			for ref in refs:
				citations.append(
					{
						"text": ref.get("content", {}).get("text", ""),
						"location": ref.get("location", {}),
						"metadata": ref.get("metadata", {}),
					}
				)

		return jsonify({"answer": answer, "citations": citations})

	except ClientError as exc:
		error_info = exc.response.get("Error", {})
		error_code = error_info.get("Code", "ClientError")
		error_message = error_info.get("Message", str(exc))
		request_id = exc.response.get("ResponseMetadata", {}).get("RequestId")

		return jsonify(
			{
				"error": error_message,
				"errorCode": error_code,
				"requestId": request_id,
				"debug": {
					"region": AWS_REGION,
					"knowledgeBaseId": KB_ID,
					"modelArn": MODEL_ARN,
					"hints": [
						"KB_ID must belong to the same AWS account and region as AWS_REGION.",
						"MODEL_ARN must be an enabled model in that same region.",
						"Your IAM user/role needs bedrock:RetrieveAndGenerate and knowledge base permissions.",
					],
				},
			}
		), 400

	except Exception as exc:
		return jsonify({"error": str(exc)}), 500


@app.get("/api/query")
def query_knowledge_base_help():
	return jsonify(
		{
			"message": "Use POST /api/query with JSON body: {\"query\": \"your question\"}",
			"example": {
				"method": "POST",
				"url": "/api/query",
				"body": {"query": "What is this knowledge base about?"},
			},
		}
	)


@app.post("/query")
def query_knowledge_base_legacy():
	# Backward-compatible route for older frontend calls.
	return query_knowledge_base()


@app.get("/query")
def query_knowledge_base_legacy_help():
	return query_knowledge_base_help()


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)
